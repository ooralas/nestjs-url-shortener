import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
} from '@nestjs/common';
import { LinksService } from './links.service';
import { CreateLinkDto } from './dto/create-link.dto';
import { UpdateLinkDto } from './dto/update-link.dto';

@Controller('links')
export class LinksController {
  constructor(private readonly linksService: LinksService) {}

  @Post()
  create(@Body() createLinkDto: CreateLinkDto) {
    return this.linksService.create(createLinkDto);
  }

  @Get()
  async findAll(@Req() request: Request) {
    console.log(request);

    return await this.linksService.findAll();
  }

  @Get(':alias')
  findOne(@Param('alias') alias: string) {
    return this.linksService.findOneByAlias(alias);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateLinkDto: UpdateLinkDto) {
    return await this.linksService.update(+id, updateLinkDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.linksService.remove(+id);
  }
}
