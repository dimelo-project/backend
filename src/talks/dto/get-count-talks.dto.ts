import { GetTalksDto } from './get-talks.dto';
import { PickType } from '@nestjs/swagger';
export class GetCountTalksDto extends PickType(GetTalksDto, [
  'category',
] as const) {}
