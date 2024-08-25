import { Controller, Delete } from '@nestjs/common';
import { CacheService } from './cache.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@Controller('cache')
@ApiTags('cache')
export class CacheController {
  constructor(private readonly cacheService: CacheService) {}

  //ToDo: Implement ADMIN role so only admin can do this.
  @Delete('reset')
  @ApiOperation({ summary: 'Clear cache completely' })
  @ApiResponse({
    status: 200,
    description: 'Cache has been cleared',
  })
  async restCache() {
    await this.cacheService.reset();
  }
}
