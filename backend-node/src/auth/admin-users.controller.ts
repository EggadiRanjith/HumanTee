import {
    Controller,
    Get,
    Param,
    Query,
    UseGuards,
    NotFoundException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AdminJwtGuard } from './guards/admin-jwt.guard';
import { AdminGuard } from './guards/admin.guard';

@Controller('admin/users')
@UseGuards(AdminJwtGuard, AdminGuard)
export class AdminUsersController {
    constructor(private readonly authService: AuthService) { }

    /**
     * Get all customers with sorting and filtering
     * GET /api/admin/users?sort=most_orders&search=ranjith
     */
    @Get()
    async getAllCustomers(
        @Query('sort') sort?: string,
        @Query('search') search?: string,
    ) {
        return this.authService.findAllCustomers({ sort, search });
    }

    /**
     * Get single customer detail
     * GET /api/admin/users/:id
     */
    @Get(':id')
    async getCustomerDetail(@Param('id') id: string) {
        const user = await this.authService.getCustomerDetail(id);
        if (!user) {
            throw new NotFoundException('Customer not found');
        }
        return user;
    }
}
