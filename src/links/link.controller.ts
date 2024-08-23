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
  NotFoundException,
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

@ApiTags('links')
@Controller('links')
export class LinkController {
  constructor(
    private readonly linksService: LinkService,
    @Inject(LinkAnalyticService)
    private readonly linkAnalyticService: LinkAnalyticService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new link' })
  @ApiBody({ type: CreateLinkDto })
  @ApiResponse({
    status: 201,
    description: 'The link has been successfully created.',
  })
  @ApiResponse({ status: 400, description: 'Invalid input data.' })
  create(@Body() createLinkDto: CreateLinkDto) {
    return this.linksService.create(createLinkDto);
  }

  @Get()
  @ApiOperation({ summary: 'Retrieve all links' })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved links.',
    type: [Link],
  })
  async findAll() {
    return await this.linksService.findAll();
  }

  @Get(':alias')
  @ApiOperation({ summary: 'Retrieve a link by alias' })
  @ApiParam({ name: 'alias', required: true, type: String })
  @ApiResponse({ status: 200, description: 'Successfully retrieved link.' })
  @ApiResponse({ status: 404, description: 'Link not found.' })
  async findOne(@Req() request: Request, @Param('alias') alias: string) {
    const link = await this.linksService.findOneByAliasAndUpdateViews(alias);

    if (link) {
      await this.linkAnalyticService.createAnalyticForLink(request, link);
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
  async update(@Param('id') id: string, @Body() updateLinkDto: UpdateLinkDto) {
    await this.linksService.updateLink(+id, updateLinkDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a link' })
  @ApiParam({ name: 'id', required: true, type: String })
  @ApiResponse({
    status: 200,
    description: 'The link has been successfully deleted.',
  })
  @ApiResponse({ status: 404, description: 'Link not found.' })
  remove(@Param('id') id: string) {
    return this.linksService.remove(+id);
  }
}
