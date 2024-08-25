import { Global, Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { CacheService } from './cache.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CacheController } from './cache.controller';
import cacheConfig from 'config/cache.config';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      load: [cacheConfig],
    }),
    CacheModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        ttl: configService.get<number>('cache.ttl'),
        max: configService.get<number>('cache.max'),
      }),
    }),
  ],
  providers: [CacheService],
  exports: [CacheService, CacheModule],
  controllers: [CacheController],
})
export class CacheManagerModule {}
