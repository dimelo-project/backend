import { CreateReviewDto } from './create-review.dto';
import { PickType, ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
export class CreateReviewWithCourseDto extends PickType(CreateReviewDto, [
  'q1',
  'q2',
  'q3',
  'q4',
  'pros',
  'cons',
] as const) {
  @ApiProperty({
    example:
      'https://www.inflearn.com/course/%EC%8A%A4%ED%94%84%EB%A7%81-mvc-1',
    description: '강의 주소',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  siteUrl: string;
}
