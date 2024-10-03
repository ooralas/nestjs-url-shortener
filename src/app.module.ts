import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LinkModule } from './links/link.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { dataSourceOptions } from 'db/data-source';
import { HealthModule } from './health/health.module';
import { LinkAnalyticModule } from './link-analytic/link-analytic.module';
import { GeolocationModule } from './geolocation/geolocation.module';
import { CacheManagerModule } from './cache/cache.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import jwtConfig from 'config/jwt.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [jwtConfig],
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (config) => ({
        secret: config.get('jwt.secret'),
      }),
      global: true,
      inject: [ConfigService],
    }),
    TypeOrmModule.forRoot(dataSourceOptions),
    LinkModule,
    HealthModule,
    LinkAnalyticModule,
    GeolocationModule,
    CacheManagerModule,
    UserModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
