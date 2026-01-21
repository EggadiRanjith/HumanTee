import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SettingsController } from './settings.controller';
import { PublicSettingsController } from './public-settings.controller';
import { SettingsService } from './settings.service';
import { SettingsCacheService } from './settings-cache.service';
import { Setting } from '../entities/setting.entity';
import { SettingHistory } from '../entities/setting-history.entity';
import { SettingsVersion } from '../entities/settings-version.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            Setting,
            SettingHistory,
            SettingsVersion,
        ]),
    ],
    controllers: [SettingsController, PublicSettingsController],
    providers: [SettingsService, SettingsCacheService],
    exports: [SettingsService, SettingsCacheService],
})
export class SettingsModule { }
