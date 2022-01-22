import { GetCoursesFromCategoryDto } from './get-courses-from-category.dto';
import { PickType } from '@nestjs/swagger';

export class GetSkillsFromCategory extends PickType(GetCoursesFromCategoryDto, [
  'categoryBig',
  'category',
]) {}
