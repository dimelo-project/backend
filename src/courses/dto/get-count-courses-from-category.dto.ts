import { GetCoursesFromCategoryDto } from './get-courses-from-category.dto';
import { PickType } from '@nestjs/swagger';

export class GetCountCoursesFromCategory extends PickType(
  GetCoursesFromCategoryDto,
  ['categoryBig', 'category', 'skill'],
) {}
