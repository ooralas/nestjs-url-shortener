import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class CreateLinkResponseDto {
  @ApiProperty({
    description: 'The long URL to be shortened',
    example: 'https://www.example.com/very/long/url/that/needs/shortening',
  })
  longLink: string;

  @ApiProperty({
    description: 'Custom alias for the shortened link',
    example: 'my-custom-alias',
  })
  alias: string;

  @ApiProperty({
    description: 'Id of the user, who created to create a short url',
    example: 'c9f73353-dfd2-48d6-839e-6322033df9d7',
  })
  @Transform(({ obj }) => {
    console.log(obj);
    return obj.user?.id;
  })
  userId?: string;
}
