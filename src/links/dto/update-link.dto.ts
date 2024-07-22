import { PartialType } from '@nestjs/mapped-types';
import { CreateLinkDto } from './create-link.dto';
import { IsInt, IsString } from 'class-validator';

export class UpdateLinkDto extends PartialType(CreateLinkDto) {
  @IsInt()
  id: number;

  @IsString()
  alias: string;

  @IsString()
  longLink: string;

  @IsInt()
  views: number;
}
