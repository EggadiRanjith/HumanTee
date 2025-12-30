import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { ContactService } from './contact.service';
import { CreateContactDto } from './dto/create-contact.dto';

@Controller('contact')
export class ContactController {
    constructor(private readonly contactService: ContactService) { }

    /**
     * Submit contact form (public endpoint, no auth required)
     * POST /api/contact
     * Rate limit: 3 requests per 10 minutes
     */
    @Post()
    @HttpCode(HttpStatus.OK)
    @Throttle({ default: { limit: 3, ttl: 600000 } }) // 3 requests per 10 minutes
    async submitContactForm(@Body() createContactDto: CreateContactDto) {
        return this.contactService.submitContactForm(createContactDto);
    }
}
