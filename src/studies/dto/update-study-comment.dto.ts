import { CreateTalkCommentDto } from './../../talks/dto/create-talk-comment.dto';
import { PickType } from '@nestjs/swagger';

export class UpdateStudyCommentDto extends PickType(CreateTalkCommentDto, [
  'commentText',
]) {}