import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

export class SearchCoursesDto {
  @ApiProperty({
    example: 'Spring',
    description: '검색할 강의 제목이나 강사이름',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  @Transform((params) => params.value.trim())
  keyword: string;
}
