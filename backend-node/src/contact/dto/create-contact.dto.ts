import { IsString, IsNotEmpty, IsEmail, MinLength, MaxLength } from 'class-validator';

export class CreateContactDto {
    @IsString()
    @IsNotEmpty()
    @MinLength(2, { message: 'Name must be at least 2 characters' })
    @MaxLength(100)
    name: string;

    @IsEmail({}, { message: 'Please enter a valid email address' })
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(3, { message: 'Subject must be at least 3 characters' })
    @MaxLength(200)
    subject: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(10, { message: 'Message must be at least 10 characters' })
    @MaxLength(2000)
    message: string;
}
