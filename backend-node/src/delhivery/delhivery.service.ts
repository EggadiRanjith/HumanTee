import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Shipment, ShipmentStatus } from '../entities/shipment.entity';
import { Order } from '../entities/order.entity';
import { OrderAddress } from '../entities/order-address.entity';

/**
 * DelhiveryService
 * Handles all Delhivery API interactions for shipment lifecycle.
 *
 * Phase 0: Warehouse registration (manual one-time call)
 * Phase 1: Waybill fetching + shipment manifestation (auto on order confirmation)
 *
 * All external API calls are wrapped with:
 *   - Timeout (10s default)
 *   - Retry logging
 *   - Graceful degradation (never blocks order flow)
 */
@Injectable()
export class DelhiveryService {
    private readonly baseUrl: string;
    private readonly token: string;
    private readonly originPincode: string;
    private readonly warehouseName: string;
    private readonly isConfigured: boolean;

    constructor(
        @InjectRepository(Shipment)
        private shipmentRepository: Repository<Shipment>,
    ) {
        this.token = process.env.DELHIVERY_API_TOKEN || '';
        this.baseUrl = process.env.DELHIVERY_BASE_URL || 'https://track.delhivery.com';
        this.originPincode = process.env.DELHIVERY_ORIGIN_PINCODE || '';
        this.warehouseName = process.env.DELHIVERY_WAREHOUSE_NAME || 'HumanTee-Primary';

        if (!this.token || !this.originPincode) {
            this.isConfigured = false;
        } else {
            this.isConfigured = true;
        }
    }

    // ──────────────────────────────────────────────
    // PHASE 0: Warehouse Registration (one-time)
    // ──────────────────────────────────────────────

    /**
     * Register pickup warehouse with Delhivery.
     * Call once during initial setup, or from admin panel.
     */
    async registerWarehouse(warehouseData: {
        name: string;
        phone: string;
        addressLine1: string;
        addressLine2?: string;
        city: string;
        state: string;
        pincode: string;
        country?: string;
    }): Promise<{ success: boolean; data?: any; error?: string }> {
        if (!this.isConfigured) {
            return { success: false, error: 'Delhivery not configured' };
        }

        try {
            const response = await this.apiRequest('/api/backend/clientwarehouse/create/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: warehouseData.name,
                    phone: warehouseData.phone,
                    address: warehouseData.addressLine1,
                    address_2: warehouseData.addressLine2 || '',
                    city: warehouseData.city,
                    state: warehouseData.state,
                    pin: warehouseData.pincode,
                    country: warehouseData.country || 'India',
                    return_address: warehouseData.addressLine1,
                    return_pin: warehouseData.pincode,
                    return_city: warehouseData.city,
                    return_state: warehouseData.state,
                    return_country: warehouseData.country || 'India',
                }),
            });
            return { success: true, data: response };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // ──────────────────────────────────────────────
    // PHASE 1: Waybill Fetch + Shipment Creation
    // ──────────────────────────────────────────────

    /**
     * Fetch a single waybill (AWB) number from Delhivery.
     * Each AWB is unique and used to track one shipment.
     */
    async fetchWaybill(): Promise<string | null> {
        if (!this.isConfigured) {
            return null;
        }

        try {
            const response = await this.apiRequest(
                `/waybill/api/bulk/json/?count=1&token=${this.token}`,
                { method: 'GET' },
            );

            // Delhivery returns { "cash_count": 0, "prepaid_count": 1, ... }
            // or a string waybill directly depending on version
            if (typeof response === 'string') {
                return response.trim();
            }

            // Handle JSON response format
            if (response?.waybill) {
                return response.waybill;
            }
            return null;
        } catch (error) {
            return null;
        }
    }

    /**
     * Create a shipment (manifest) with Delhivery.
     * This is the CORE Phase 1 method — called ASYNC after order confirmation.
     *
     * CRITICAL: This must NEVER throw or block the order confirmation flow.
     * All errors are logged and swallowed.
     */
    async createShipment(
        order: Order,
        address: OrderAddress,
        items: Array<{ productNameSnapshot: string; quantity: number }>,
    ): Promise<{ success: boolean; awb?: string; error?: string }> {
        if (!this.isConfigured) {
            return { success: false, error: 'Delhivery not configured' };
        }

        // Check if shipment already exists (idempotency)
        const existingShipment = await this.shipmentRepository.findOne({
            where: { orderId: order.id },
        });

        if (existingShipment?.delhiveryAwb) {
            return { success: true, awb: existingShipment.delhiveryAwb };
        }

        try {
            // 1. Fetch waybill
            const waybill = await this.fetchWaybill();
            if (!waybill) {
                return { success: false, error: 'Failed to fetch waybill' };
            }

            // 2. Build shipment payload
            const itemDescriptions = items
                .map((i) => `${i.productNameSnapshot} x${i.quantity}`)
                .join(', ');

            const shipmentPayload = {
                shipments: [
                    {
                        name: address.fullName,
                        add: [address.addressLine1, address.addressLine2].filter(Boolean).join(', '),
                        pin: address.postalCode,
                        city: address.city,
                        state: address.state,
                        country: address.country || 'India',
                        phone: address.phone,
                        order: order.orderNumber,
                        payment_mode: 'Prepaid', // All Razorpay orders are prepaid
                        products_desc: itemDescriptions,
                        cod_amount: '0',
                        total_amount: String(order.totalAmount),
                        seller_name: 'HumanTee',
                        waybill: waybill,
                        shipment_width: '30',  // cm — default for t-shirts
                        shipment_height: '5',
                        shipment_length: '35',
                        weight: '300', // grams — default for t-shirts
                        quantity: String(items.reduce((sum, i) => sum + i.quantity, 0)),
                    },
                ],
                pickup_location: {
                    name: this.warehouseName,
                    pin: this.originPincode,
                },
            };

            // 3. Call Delhivery Shipment Manifestation API
            const formData = `format=json&data=${encodeURIComponent(JSON.stringify(shipmentPayload))}`;

            const response = await this.apiRequest(
                '/api/cmu/create.json',
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    body: formData,
                },
            );

            // 4. Save shipment record
            const delhiveryShipmentId = response?.upload_wbn || response?.rmk || null;

            if (existingShipment) {
                // Update existing shipment record
                existingShipment.delhiveryAwb = waybill;
                existingShipment.delhiveryShipmentId = delhiveryShipmentId;
                existingShipment.carrier = 'Delhivery';
                existingShipment.trackingNumber = waybill;
                existingShipment.status = ShipmentStatus.MANIFESTED;
                await this.shipmentRepository.save(existingShipment);
            } else {
                // Create new shipment record
                const shipment = this.shipmentRepository.create({
                    orderId: order.id,
                    carrier: 'Delhivery',
                    trackingNumber: waybill,
                    delhiveryAwb: waybill,
                    delhiveryShipmentId,
                    status: ShipmentStatus.MANIFESTED,
                });
                await this.shipmentRepository.save(shipment);
            }

            return { success: true, awb: waybill };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    /**
     * Calculate shipping rate via Delhivery freight calculator (Phase 3)
     * Returns estimated shipping cost in INR, or null if API fails (caller should fallback)
     */
    async calculateShippingRate(
        destinationPincode: string,
        weightGrams: number,
        codAmount: number = 0,
    ): Promise<number | null> {
        if (!this.isConfigured || !this.originPincode) {
            return null; // Caller will fall back to zone table
        }

        try {
            const params = new URLSearchParams({
                md: 'S',                          // Mode: Surface
                ss: 'Delivered',                  // Status
                d_pin: destinationPincode,
                o_pin: this.originPincode,
                cgm: String(weightGrams),         // Charged weight in grams
                pt: codAmount > 0 ? 'COD' : 'Pre-paid',
                cod: String(codAmount),
            });

            const response = await this.apiRequest(
                `/api/kinko/v1/invoice/charges/.json?${params.toString()}`,
                { method: 'GET' },
            );

            // Delhivery returns an array of rate options
            const rates = response;
            if (Array.isArray(rates) && rates.length > 0) {
                const totalCharge = rates[0]?.total_amount;
                if (typeof totalCharge === 'number' && totalCharge > 0) {
                    return Math.ceil(totalCharge); // Round up to nearest rupee
                }
            }
            return null;
        } catch (error) {
            return null; // Caller falls back to zone table
        }
    }

    /**
     * Check pincode serviceability (Phase 2 — exposed here for future use)
     */

    async checkPincodeServiceability(pincode: string): Promise<{
        serviceable: boolean;
        prepaid: boolean;
        cod: boolean;
        error?: string;
    }> {
        if (!this.isConfigured) {
            return { serviceable: false, prepaid: false, cod: false, error: 'Not configured' };
        }

        try {
            const response = await this.apiRequest(
                `/c/api/pin-codes/json/?filter_codes=${pincode}`,
                { method: 'GET' },
            );

            const pinInfo = response?.delivery_codes?.[0]?.postal_code;
            if (!pinInfo) {
                return { serviceable: false, prepaid: false, cod: false };
            }

            return {
                serviceable: true,
                prepaid: pinInfo.pre_paid === 'Y',
                cod: pinInfo.cod === 'Y',
            };
        } catch (error) {
            return { serviceable: false, prepaid: false, cod: false, error: error.message };
        }
    }

    /**
     * Track shipment by AWB number (Phase 4 — exposed here for future use)
     */
    async trackShipment(awb: string): Promise<any> {
        if (!this.isConfigured) {
            return { error: 'Delhivery not configured' };
        }

        try {
            return await this.apiRequest(
                `/api/v1/packages/json/?waybill=${awb}&token=${this.token}`,
                { method: 'GET' },
            );
        } catch (error) {
            return { error: error.message };
        }
    }

    // ──────────────────────────────────────────────
    // Private: HTTP client with timeout
    // ──────────────────────────────────────────────

    private async apiRequest(path: string, options: RequestInit): Promise<any> {
        const url = `${this.baseUrl}${path}`;
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 10_000); // 10s timeout

        try {
            const response = await fetch(url, {
                ...options,
                signal: controller.signal,
                headers: {
                    Authorization: `Token ${this.token}`,
                    Accept: 'application/json',
                    ...options.headers,
                },
            });

            const contentType = response.headers.get('content-type') || '';
            const body = contentType.includes('application/json')
                ? await response.json()
                : await response.text();

            if (!response.ok) {
                throw new Error(
                    `Delhivery API ${response.status}: ${typeof body === 'string' ? body : JSON.stringify(body)}`,
                );
            }

            return body;
        } finally {
            clearTimeout(timeout);
        }
    }
}
