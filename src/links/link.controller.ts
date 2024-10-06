import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  Inject,
  UseGuards,
} from '@nestjs/common';
import { LinkService } from './link.service';
import { CreateLinkDto } from './dto/create-link.dto';
import { UpdateLinkDto } from './dto/update-link.dto';

import { LinkAnalyticService } from 'src/link-analytic/link-analytic.service';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
} from '@nestjs/swagger';
import { Link } from './entities/link.entity';
import { AuthGuard } from 'src/common/guards/auth/auth.guard';
import { UserId } from 'src/common/decorators/userParam.decorators';
import { CacheService } from 'src/cache/cache.service';
import { Roles } from 'src/common/decorators/roles.decorators';
import { Role } from 'src/common/enums/role.enum';
import { RolesGuard } from 'src/common/guards/roles/roles.guard';

@ApiTags('links')
@Controller('links')
@UseGuards(AuthGuard)
export class LinkController {
  constructor(
    private readonly linksService: LinkService,
    @Inject(LinkAnalyticService)
    private readonly linkAnalyticService: LinkAnalyticService,
    @Inject(CacheService)
    private readonly cacheService: CacheService,
  ) {}

  @Get('all')
  @ApiOperation({
    summary:
      'Retrive all links of all users. Only avilable for users, who have admin role',
  })
  @ApiResponse({ status: 403, description: 'Forbidden resource' })
  @Roles(Role.ADMIN)
  @UseGuards(RolesGuard)
  getAllLinks() {
    return this.linksService.getAllLinks();
  }

  @Post()
  @ApiOperation({ summary: 'Create a new link' })
  @ApiBody({ type: CreateLinkDto })
  @ApiResponse({
    status: 201,
    description: 'The link has been successfully created.',
    type: CreateLinkDto,
  })
  @ApiResponse({ status: 400, description: 'Invalid input data.' })
  create(@UserId() userId: string, @Body() createLinkDto: CreateLinkDto) {
    return this.linksService.create(userId, createLinkDto);
  }

  @Get()
  @ApiOperation({ summary: 'Retrieve all links.' })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved links.',
    type: [Link],
  })
  async findAll(@UserId() userId: string) {
    return await this.linksService.findAll(userId);
  }

  @Get(':alias')
  @ApiOperation({ summary: 'Retrieve a link by alias' })
  @ApiParam({ name: 'alias', required: true, type: String })
  @ApiResponse({ status: 200, description: 'Successfully retrieved link.' })
  @ApiResponse({ status: 404, description: 'Link not found.' })
  async findOne(
    @Req() request: Request,
    @Param('alias') alias: string,
    @UserId() userId: string,
  ) {
    const link = await this.linksService.getLinkFromCacheOrDatabase(
      alias,
      userId,
    );

    if (link) {
      this.linkAnalyticService.createAnalyticForLink(request, link);
    }

    return link.longLink;
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a link' })
  @ApiParam({ name: 'id', required: true, type: String })
  @ApiBody({ type: UpdateLinkDto })
  @ApiResponse({
    status: 200,
    description: 'The link has been successfully updated.',
  })
  @ApiResponse({ status: 404, description: 'Link not found.' })
  async update(
    @Param('id') id: string,
    @Body() updateLinkDto: UpdateLinkDto,
    @UserId() userId: string,
  ) {
    await this.linksService.updateLink(+id, updateLinkDto, userId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a link' })
  @ApiParam({ name: 'id', required: true, type: String })
  @ApiResponse({
    status: 200,
    description: 'The link has been successfully deleted.',
  })
  @ApiResponse({ status: 404, description: 'Link not found.' })
  remove(@Param('id') id: string, @UserId() userId: string) {
    return this.linksService.remove(+id, userId);
  }
}
