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

@Controller('links')
export class LinkController {
  constructor(
    private readonly linksService: LinkService,
    @Inject(LinkAnalyticService)
    private readonly linkAnalyticService: LinkAnalyticService,
  ) {}

  @Post()
  create(@Body() createLinkDto: CreateLinkDto) {
    return this.linksService.create(createLinkDto);
  }

  @Get()
  async findAll(@Req() request: Request) {
    console.log(await this.linkAnalyticService.findAll());

    return await this.linksService.findAll();
  }

  @Get(':alias')
  async findOne(@Req() request: Request, @Param('alias') alias: string) {
    const link = await this.linksService.findOneByAliasAndUpdateViews(alias);

    this.linkAnalyticService.findAll();

    if (link) {
      await this.linkAnalyticService.createAnalyticForLink(request, link);
    }

    //TODO redirect user to the long link
    return link.longLink;
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateLinkDto: UpdateLinkDto) {
    return await this.linksService.updateLink(+id, updateLinkDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.linksService.remove(+id);
  }
}
