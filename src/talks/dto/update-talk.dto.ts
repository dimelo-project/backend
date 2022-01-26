import { CreateTalkDto } from './create-talk.dto';
import { PickType } from '@nestjs/swagger';

export class UpdateTalkDto extends PickType(CreateTalkDto, [
  'category',
  'title',
  'content',
] as const) {}
