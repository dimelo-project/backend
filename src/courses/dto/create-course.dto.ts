import { ApiProperty, PickType } from '@nestjs/swagger';
import { Courses } from 'src/entities/Courses';

export class CreateCourseDto extends PickType(Courses, [
  'title',
  'platform',
  'categoryBig',
  'categorySmall',
  'price',
  'siteUrl',
]) {
  @ApiProperty({
    example: 'Spring',
    description: '강의에서 가르치는 기술',
  })
  skill: string;

  @ApiProperty({
    example: '김영한',
    description: '강사 이름',
  })
  instructor: string;
}
