import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class SearchTalkDto {
  @ApiProperty({
    example: '문과생',
    description: '검색할 키워드',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  @Transform((params) => params.value.trim())
  keyword: string;
}
