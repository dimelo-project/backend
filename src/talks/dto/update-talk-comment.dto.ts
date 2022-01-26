import { CreateTalkCommentDto } from './create-talk-comment.dto';
import { PickType } from '@nestjs/swagger';
export class UpdateTalkCommentDto extends PickType(CreateTalkCommentDto, [
  'commentText',
] as const) {}
