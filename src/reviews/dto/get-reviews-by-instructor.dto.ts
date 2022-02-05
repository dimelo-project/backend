import { GetReviewsByCourseDto } from './get-reviews-by-course.dto';
import { PickType } from '@nestjs/swagger';

export class GetReviewsByInstructorDto extends PickType(GetReviewsByCourseDto, [
  'perPage',
  'page',
  'sort',
  'order',
] as const) {}
