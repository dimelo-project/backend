import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsArray, IsEnum, IsOptional, IsString } from 'class-validator';

export class GetStudiesDto {
  @ApiProperty({
    example: 'JavaScript',
    description: '필터링할 스킬',
    required: false,
  })
  @IsArray()
  @Transform(({ value }) => value.split(','))
  @IsOptional()
  skills: string[];

  @ApiProperty({
    example: '모집중',
    description: '모집중/모집완료',
    required: false,
  })
  @IsOptional()
  @IsString()
  @IsEnum(['모집중', '모집완료'])
  ongoing: '모집중' | '모집완료';
}
