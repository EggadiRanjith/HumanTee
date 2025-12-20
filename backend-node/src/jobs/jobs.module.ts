import { Module, Global } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JobMonitorService } from './job-monitor.service';
import { BackgroundJob } from './entities/background-job.entity';

@Global()
@Module({
    imports: [TypeOrmModule.forFeature([BackgroundJob])],
    providers: [JobMonitorService],
    exports: [JobMonitorService],
})
export class JobsModule { }
