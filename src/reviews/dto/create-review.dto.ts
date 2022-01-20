import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

type Grade = 1 | 2 | 3 | 4 | 5;
export class CreateReviewDto {
  @ApiProperty({
    example: 5,
    description: '1-5 중의 점수',
    required: true,
  })
  @IsNumber()
  @IsEnum([1, 2, 3, 4, 5])
  @IsNotEmpty()
  q1: Grade;

  @ApiProperty({
    example: 5,
    description: '1-5 중의 점수',
    required: true,
  })
  @IsNumber()
  @IsEnum([1, 2, 3, 4, 5])
  @IsNotEmpty()
  q2: Grade;

  @ApiProperty({
    example: 4,
    description: '1-5 중의 점수',
    required: true,
  })
  @IsNumber()
  @IsEnum([1, 2, 3, 4, 5])
  @IsNotEmpty()
  q3: Grade;

  @ApiProperty({
    example: 3,
    description: '1-5 중의 점수',
    required: true,
  })
  @IsNumber()
  @IsEnum([1, 2, 3, 4, 5])
  @IsNotEmpty()
  q4: Grade;

  @ApiProperty({
    example: '좋아요 들으세요',
    description: '강의의 장점',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  pros: string;

  @ApiProperty({
    example: '별로에요 듣지마세요',
    description: '강의의 단점',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  cons: string;
}
