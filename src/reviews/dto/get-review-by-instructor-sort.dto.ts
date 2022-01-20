import { GetReviewByCourseSortDto } from './get-review-by-course-sort.dto';
import { PickType } from '@nestjs/swagger';

export class GetReviewByInstructorSortDto extends PickType(
  GetReviewByCourseSortDto,
  ['sort', 'order'],
) {}
