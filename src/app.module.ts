import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LinkModule } from './links/link.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { dataSourceOptions } from 'db/data-source';
import { HealthModule } from './health/health.module';
import { LinkAnalyticModule } from './link-analytic/link-analytic.module';
import { GeolocationModule } from './geolocation/geolocation.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot(dataSourceOptions),
    LinkModule,
    HealthModule,
    LinkAnalyticModule,
    GeolocationModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
