import { Module } from '@nestjs/common';
import { SettingsModule } from './settings.module';
import { MaintenancePublicController, MaintenanceAdminController } from './maintenance.controller';

@Module({
    imports: [SettingsModule],
    controllers: [MaintenancePublicController, MaintenanceAdminController],
})
export class MaintenanceModule { }
