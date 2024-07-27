import { Module } from '@nestjs/common';
import { LinkAnalyticService } from './link-analytic.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LinkAnalytic } from './entities/link-analytic.entity';

@Module({
  providers: [LinkAnalyticService],
  imports: [TypeOrmModule.forFeature([LinkAnalytic])],
  exports: [LinkAnalyticService],
})
export class LinkAnalyticModule {}
