import { PartialType } from '@nestjs/mapped-types';
import { CreateLinkDto } from './create-link.dto';
import { IsInt, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateLinkDto extends PartialType(CreateLinkDto) {
  @IsInt()
  @ApiProperty({
    description: 'The ID of the link',
    example: 1,
  })
  id: number;

  @IsString()
  @ApiProperty({
    description: 'Optional alias for the link',
    example: 'example-alias',
  })
  alias: string;

  @IsString()
  @ApiProperty({
    description: 'The original long link that the alias will redirect to',
    example: 'https://example.com',
  })
  longLink: string;

  @IsInt()
  @ApiProperty({
    description: 'Number of views the link has received',
    example: 100,
  })
  views: number;
}
