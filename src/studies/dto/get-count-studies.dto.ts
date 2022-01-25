import { GetStudiesDto } from './get-studies.dto';
import { PickType } from '@nestjs/swagger';
export class GetCountStudiesDto extends PickType(GetStudiesDto, [
  'ongoing',
  'skills',
]) {}
