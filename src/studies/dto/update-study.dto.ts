import { IsNotEmpty, IsString, IsEnum } from 'class-validator';
import { CreateStudyDto } from './create-study.dto';
import { PickType, ApiProperty } from '@nestjs/swagger';
export class UpdateStudyDto extends PickType(CreateStudyDto, [
  'title',
  'content',
  'markup',
  'participant',
  'skills',
] as const) {
  @ApiProperty({
    example: '모집중',
    description: '모집중/모집완료',
    required: true,
    type: 'string',
    enum: ['모집중', '모집완료'],
  })
  @IsNotEmpty()
  @IsString()
  @IsEnum(['모집중', '모집완료'])
  ongoing: '모집중' | '모집완료';
}
