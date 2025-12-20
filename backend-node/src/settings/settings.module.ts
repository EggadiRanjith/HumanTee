import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SettingsService } from './settings.service';
import { SettingsValidator } from './settings.validator';
import { SettingsHistory } from './entities/settings-history.entity';
import { AuditModule } from '../audit/audit.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([SettingsHistory]),
        AuditModule,
    ],
    providers: [SettingsService, SettingsValidator],
    exports: [SettingsService, SettingsValidator],
})
export class SettingsModule { }
