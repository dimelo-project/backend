import { CreateTalkCommentDto } from './../../talks/dto/create-talk-comment.dto';
import { PickType } from '@nestjs/swagger';
export class CreateStudyComment extends PickType(CreateTalkCommentDto, [
  'commentText',
]) {}
