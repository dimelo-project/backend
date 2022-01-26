import { CreateTalkCommentDto } from './../../talks/dto/create-talk-comment.dto';
import { PickType } from '@nestjs/swagger';
export class CreateProjectCommentDto extends PickType(CreateTalkCommentDto, [
  'commentText',
] as const) {}
