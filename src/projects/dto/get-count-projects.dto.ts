import { GetProjectsDto } from './get-projects.dto';
import { PickType } from '@nestjs/swagger';
export class GetCountProjectsDto extends PickType(GetProjectsDto, [
  'ongoing',
  'positions',
  'skills',
]) {}
