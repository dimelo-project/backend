import { GetTalksDto } from './get-talks.dto';
import { PickType } from '@nestjs/swagger';
export class GetCountTalksFromCategoryDto extends PickType(GetTalksDto, [
  'category',
]) {}
