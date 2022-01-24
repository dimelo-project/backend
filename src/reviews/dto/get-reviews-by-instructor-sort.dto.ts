import { GetReviewsByCourseSortDto } from './get-reviews-by-course-sort.dto';
import { PickType } from '@nestjs/swagger';

export class GetReviewsByInstructorSortDto extends PickType(
  GetReviewsByCourseSortDto,
  ['perPage', 'page', 'sort', 'order'],
) {}
