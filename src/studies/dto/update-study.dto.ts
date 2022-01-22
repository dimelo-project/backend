import { CreateStudyDto } from './create-study.dto';
import { PickType } from '@nestjs/swagger';
export class UpdateStudyDto extends PickType(CreateStudyDto, [
  'title',
  'content',
  'ongoing',
  'duedate',
  'participant',
  'skills',
]) {}
