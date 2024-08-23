import { Module } from '@nestjs/common';
import { GeolocationService } from './geolocation.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  providers: [GeolocationService],
  exports: [GeolocationService],
})
export class GeolocationModule {}
