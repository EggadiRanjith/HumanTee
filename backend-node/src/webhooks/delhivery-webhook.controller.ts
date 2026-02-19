import {
    Controller,
    Post,
    Get,
    Body,
    Param,
    Logger,
    HttpCode,
    HttpStatus,
    BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Shipment, ShipmentStatus } from '../entities/shipment.entity';
import { Order, OrderStatus } from '../entities/order.entity';
import { OrderStatusHistory } from '../entities/order-status-history.entity';
import { DelhiveryService } from '../delhivery/delhivery.service';

/**
 * Delhivery Webhook Controller
 * 
 * Receives real-time shipment status updates from Delhivery.
 * POST /webhooks/delhivery — called by Delhivery when shipment status changes
 * GET  /webhooks/delhivery/track/:awb — customer-facing tracking lookup
 * 
 * SECURITY NOTE: Delhivery webhooks don't have signature verification.
 * We validate by checking the AWB exists in our database.
 */
@Controller('webhooks/delhivery')
export class DelhiveryWebhookController {
    private readonly logger = new Logger(DelhiveryWebhookController.name);

    constructor(
        @InjectRepository(Shipment)
        private shipmentRepository: Repository<Shipment>,
        @InjectRepository(Order)
        private orderRepository: Repository<Order>,
        private dataSource: DataSource,
        private delhiveryService: DelhiveryService,
    ) { }

    /**
     * Delhivery Webhook — receives status push notifications
     * POST /webhooks/delhivery
     * 
     * Delhivery sends: { Awb, ShipmentId, Status { Status, StatusLocation, StatusDateTime, Instructions } }
     */
    @Post()
    @HttpCode(HttpStatus.OK)
    async handleWebhook(@Body() payload: any) {
        const awb = payload?.Awb || payload?.waybill;
        const statusObj = payload?.Status || {};
        const statusCode = statusObj?.Status || payload?.status;

        if (!awb) {
            this.logger.warn('Delhivery webhook received without AWB — ignoring');
            return { success: false, error: 'Missing AWB' };
        }

        this.logger.log(`Delhivery webhook: AWB ${awb} → ${statusCode}`);

        // Find shipment by AWB
        const shipment = await this.shipmentRepository.findOne({
            where: { delhiveryAwb: awb },
        });

        if (!shipment) {
            this.logger.warn(`Delhivery webhook: Unknown AWB ${awb} — ignoring`);
            return { success: false, error: 'Unknown AWB' };
        }

        // Map Delhivery status to internal ShipmentStatus
        const mappedStatus = this.mapDelhiveryStatus(statusCode);
        if (!mappedStatus) {
            this.logger.log(`Delhivery webhook: Unmapped status "${statusCode}" for AWB ${awb}`);
            return { success: true, message: 'Status not mapped — no action taken' };
        }

        // Skip if status hasn't changed (idempotency)
        if (shipment.status === mappedStatus) {
            return { success: true, message: 'Status unchanged' };
        }

        // Update in transaction
        await this.dataSource.transaction(async (manager) => {
            // Update shipment status
            const updateData: Partial<Shipment> = { status: mappedStatus };

            if (mappedStatus === ShipmentStatus.SHIPPED || mappedStatus === ShipmentStatus.PICKED_UP) {
                updateData.shippedAt = new Date();
            }
            if (mappedStatus === ShipmentStatus.DELIVERED) {
                updateData.deliveredAt = new Date();
            }

            await manager.update(Shipment, { id: shipment.id }, updateData);

            // Also update Order status if relevant
            const orderStatusUpdate = this.mapToOrderStatus(mappedStatus);
            if (orderStatusUpdate) {
                const order = await manager.findOne(Order, { where: { id: shipment.orderId } });
                if (order && order.status !== orderStatusUpdate) {
                    const previousStatus = order.status;
                    await manager.update(Order, { id: order.id }, { status: orderStatusUpdate });

                    // Create status history
                    const history = manager.create(OrderStatusHistory, {
                        orderId: order.id,
                        fromStatus: previousStatus,
                        toStatus: orderStatusUpdate,
                        reason: `Delhivery: ${statusCode} (AWB: ${awb})`,
                    });
                    await manager.save(OrderStatusHistory, history);
                }
            }
        });

        this.logger.log(`Shipment ${awb} updated: ${shipment.status} → ${mappedStatus}`);

        return { success: true, awb, status: mappedStatus };
    }

    /**
     * Customer-facing tracking endpoint
     * GET /webhooks/delhivery/track/:awb
     * 
     * Fetches live tracking from Delhivery API (not cached — always fresh)
     */
    @Get('track/:awb')
    async trackShipment(@Param('awb') awb: string) {
        if (!awb || awb.length < 5) {
            throw new BadRequestException('Valid AWB number required');
        }

        // First check if AWB belongs to us
        const shipment = await this.shipmentRepository.findOne({
            where: { delhiveryAwb: awb },
            relations: ['order'],
        });

        if (!shipment) {
            throw new BadRequestException('Shipment not found');
        }

        // Fetch live tracking from Delhivery
        const trackingData = await this.delhiveryService.trackShipment(awb);

        return {
            awb,
            orderNumber: shipment.order?.orderNumber,
            status: shipment.status,
            shippedAt: shipment.shippedAt,
            deliveredAt: shipment.deliveredAt,
            carrier: shipment.carrier,
            tracking: trackingData,
        };
    }

    // ──────────────────────────────────────────────
    // Private: Status Mapping
    // ──────────────────────────────────────────────

    /**
     * Map Delhivery status strings to internal ShipmentStatus
     * Delhivery statuses: https://www.delhivery.com/developers
     */
    private mapDelhiveryStatus(delhiveryStatus: string): ShipmentStatus | null {
        if (!delhiveryStatus) return null;

        const normalized = delhiveryStatus.toLowerCase().trim();
        const statusMap: Record<string, ShipmentStatus> = {
            'manifested': ShipmentStatus.MANIFESTED,
            'in transit': ShipmentStatus.IN_TRANSIT,
            'pending': ShipmentStatus.IN_TRANSIT,
            'dispatched': ShipmentStatus.IN_TRANSIT,
            'picked up': ShipmentStatus.PICKED_UP,
            'reached at destination hub': ShipmentStatus.IN_TRANSIT,
            'out for delivery': ShipmentStatus.OUT_FOR_DELIVERY,
            'delivered': ShipmentStatus.DELIVERED,
            'rto initiated': ShipmentStatus.RTO,
            'rto delivered': ShipmentStatus.RTO,
            'not picked': ShipmentStatus.FAILED,
            'undelivered': ShipmentStatus.FAILED,
        };

        return statusMap[normalized] || null;
    }

    /**
     * Map ShipmentStatus to OrderStatus (only for terminal states)
     */
    private mapToOrderStatus(shipmentStatus: ShipmentStatus): OrderStatus | null {
        switch (shipmentStatus) {
            case ShipmentStatus.SHIPPED:
            case ShipmentStatus.PICKED_UP:
            case ShipmentStatus.IN_TRANSIT:
                return OrderStatus.SHIPPED;
            case ShipmentStatus.DELIVERED:
                return OrderStatus.DELIVERED;
            default:
                return null; // Don't auto-update order for intermediate states
        }
    }
}
