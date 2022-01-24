import { GetCoursesFromCategoryDto } from './get-courses-from-category.dto';
import { PickType } from '@nestjs/swagger';

export class GetCountCoursesFromCategoryDto extends PickType(
  GetCoursesFromCategoryDto,
  ['categoryBig', 'category', 'skill'],
) {}
