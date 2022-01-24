import { GetTalksDto } from './get-talks.dto';
import { PickType } from '@nestjs/swagger';
export class GetCountTalksFromCategory extends PickType(GetTalksDto, [
  'category',
]) {}
