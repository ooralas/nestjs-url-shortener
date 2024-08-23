import { Module } from '@nestjs/common';
import { LinkService } from './link.service';
import { LinkController } from './link.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Link } from './entities/link.entity';
import { LinkAnalyticModule } from 'src/link-analytic/link-analytic.module';
import { GeolocationModule } from 'src/geolocation/geolocation.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Link]),
    LinkAnalyticModule,
    GeolocationModule,
  ],
  controllers: [LinkController],
  providers: [LinkService],
  exports: [LinkService],
})
export class LinkModule {}
