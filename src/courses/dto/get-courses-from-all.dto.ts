import { GetCoursesFromCategoryDto } from './get-courses-from-category.dto';
import { PickType } from '@nestjs/swagger';

export class GetCoursesFromAllDto extends PickType(GetCoursesFromCategoryDto, [
  'perPage',
  'page',
  'sort',
] as const) {}
