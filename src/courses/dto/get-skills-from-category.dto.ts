import { GetCoursesFromCategoryDto } from './get-courses-from-category.dto';
import { PickType } from '@nestjs/swagger';

export class GetSkillsFromCategoryDto extends PickType(GetCoursesFromCategoryDto, [
  'categoryBig',
  'category',
]) {}
