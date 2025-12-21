import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ShippingAddress } from '../entities/shipping-address.entity';
import { CreateShippingAddressDto } from './dto/create-shipping-address.dto';
import { UpdateShippingAddressDto } from './dto/update-shipping-address.dto';

@Injectable()
export class ShippingService {
    constructor(
        @InjectRepository(ShippingAddress)
        private shippingAddressRepository: Repository<ShippingAddress>,
    ) { }

    async create(userId: string, createDto: CreateShippingAddressDto): Promise<ShippingAddress> {
        // If this is set as default, unset other default addresses
        if (createDto.isDefault) {
            await this.shippingAddressRepository.update(
                { userId, isDefault: true },
                { isDefault: false },
            );
        }

        const address = this.shippingAddressRepository.create({
            ...createDto,
            userId,
        });

        return await this.shippingAddressRepository.save(address);
    }

    async findAll(userId: string): Promise<ShippingAddress[]> {
        return await this.shippingAddressRepository.find({
            where: { userId },
            order: { isDefault: 'DESC', createdAt: 'DESC' },
        });
    }

    async findOne(id: string, userId: string): Promise<ShippingAddress> {
        const address = await this.shippingAddressRepository.findOne({
            where: { id, userId },
        });

        if (!address) {
            throw new NotFoundException('Shipping address not found');
        }

        return address;
    }

    async findDefault(userId: string): Promise<ShippingAddress | null> {
        return await this.shippingAddressRepository.findOne({
            where: { userId, isDefault: true },
        });
    }

    async update(
        id: string,
        userId: string,
        updateDto: UpdateShippingAddressDto,
    ): Promise<ShippingAddress> {
        const address = await this.findOne(id, userId);

        // If setting as default, unset other default addresses
        if (updateDto.isDefault) {
            await this.shippingAddressRepository.update(
                { userId, isDefault: true },
                { isDefault: false },
            );
        }

        Object.assign(address, updateDto);
        return await this.shippingAddressRepository.save(address);
    }

    async setDefault(id: string, userId: string): Promise<ShippingAddress> {
        const address = await this.findOne(id, userId);

        // Unset other default addresses
        await this.shippingAddressRepository.update(
            { userId, isDefault: true },
            { isDefault: false },
        );

        address.isDefault = true;
        return await this.shippingAddressRepository.save(address);
    }

    async updateDefault(userId: string, updateDto: UpdateShippingAddressDto): Promise<ShippingAddress> {
        // Find the default address
        const defaultAddress = await this.findDefault(userId);

        if (!defaultAddress) {
            throw new NotFoundException('No default address found');
        }

        // Update the default address
        Object.assign(defaultAddress, updateDto);
        return await this.shippingAddressRepository.save(defaultAddress);
    }

    async remove(id: string, userId: string): Promise<void> {
        const address = await this.findOne(id, userId);

        // Soft delete
        await this.shippingAddressRepository.softRemove(address);
    }
}
