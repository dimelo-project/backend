import { CreateTalkCommentDto } from './../../talks/dto/create-talk-comment.dto';
import { PickType } from '@nestjs/swagger';
export class CreateStudyCommentDto extends PickType(CreateTalkCommentDto, [
  'commentText',
]) {}
