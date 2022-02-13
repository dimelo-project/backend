import { CreateStudyDto } from './create-study.dto';
import { PickType } from '@nestjs/swagger';
export class UpdateStudyDto extends PickType(CreateStudyDto, [
  'title',
  'content',
  'markup',
  'ongoing',
  'participant',
  'skills',
] as const) {}
