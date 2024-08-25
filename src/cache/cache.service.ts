import { Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';

@Injectable()
export class CacheService {
  constructor(@Inject('CACHE_MANAGER') private cacheManger: Cache) {}

  async set(key: string, value: any): Promise<void> {
    this.cacheManger.set(key, value);
  }

  async get<T>(key: string): Promise<T | undefined> {
    return this.cacheManger.get<T>(key);
  }

  async del(key: string): Promise<void> {
    this.cacheManger.del(key);
  }

  async reset(): Promise<void> {
    console.log('cache reset');
    this.cacheManger.reset();
  }
}
