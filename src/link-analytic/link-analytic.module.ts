import { Module } from '@nestjs/common';
import { LinkAnalyticService } from './link-analytic.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LinkAnalytic } from './entities/link-analytic.entity';
import { GeolocationModule } from 'src/geolocation/geolocation.module';

@Module({
  providers: [LinkAnalyticService],
  imports: [TypeOrmModule.forFeature([LinkAnalytic]), GeolocationModule],
  exports: [LinkAnalyticService],
})
export class LinkAnalyticModule {}
