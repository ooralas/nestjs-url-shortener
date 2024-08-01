import { IsInt, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateLinkDto {
  @ApiProperty({
    description: 'The long URL to be shortened',
    example: 'https://www.example.com/very/long/url/that/needs/shortening',
  })
  @IsString()
  longLink: string;

  @ApiProperty({
    description: 'Custom alias for the shortened link (optional)',
    required: false,
    example: 'my-custom-alias',
  })
  @IsOptional()
  @IsString()
  alias?: string;
}
