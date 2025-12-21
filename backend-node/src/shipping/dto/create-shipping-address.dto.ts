import { IsString, IsEmail, IsNotEmpty, IsOptional, IsBoolean, MaxLength } from 'class-validator';

export class CreateShippingAddressDto {
    @IsString()
    @IsNotEmpty()
    @MaxLength(255)
    fullName: string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(20)
    phone: string;

    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(100)
    houseNumber: string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(500)
    address: string;

    @IsString()
    @IsOptional()
    @MaxLength(255)
    landmark?: string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(100)
    city: string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(100)
    state: string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(20)
    postalCode: string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(100)
    country: string;

    @IsString()
    @IsOptional()
    @MaxLength(20)
    addressType?: string;

    @IsBoolean()
    @IsOptional()
    isDefault?: boolean;
}
