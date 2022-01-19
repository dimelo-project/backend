import { PickType } from '@nestjs/swagger';
import { CreateReviewDto } from './create-review.dto';

export class UpdateReviewDto extends PickType(CreateReviewDto, [
  'q1',
  'q2',
  'q3',
  'q4',
  'pros',
  'cons',
]) {}
