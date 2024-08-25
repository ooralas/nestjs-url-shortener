import { registerAs } from '@nestjs/config';

export default registerAs('cache', () => ({
  ttl: parseInt(process.env.CACHE_TTL) || 0,
  max: parseInt(process.env.CACHE_MAX) || 10000,
}));
