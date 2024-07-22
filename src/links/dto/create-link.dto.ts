import { IsInt, IsOptional, IsString } from 'class-validator';

export class CreateLinkDto {
  @IsString()
  longLink: string;

  @IsOptional()
  alias?: string;
}
