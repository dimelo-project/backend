import { GetStudiesDto } from './get-studies.dto';
import { PickType } from '@nestjs/swagger';
export class GetCountStudiesFromCategoryDto extends PickType(GetStudiesDto, [
  'ongoing',
  'skills',
]) {}
