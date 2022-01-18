import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateReviewDto {
  @ApiProperty({
    example: 5,
    description: '1-5 중의 점수',
    required: true,
  })
  @IsNumber()
  @IsNotEmpty()
  q1: number;

  @ApiProperty({
    example: 5,
    description: '1-5 중의 점수',
    required: true,
  })
  @IsNumber()
  @IsNotEmpty()
  q2: number;

  @ApiProperty({
    example: 4,
    description: '1-5 중의 점수',
    required: true,
  })
  @IsNumber()
  @IsNotEmpty()
  q3: number;

  @ApiProperty({
    example: 3,
    description: '1-5 중의 점수',
    required: true,
  })
  @IsNumber()
  @IsNotEmpty()
  q4: number;

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

  @ApiProperty({
    example:
      'https://www.inflearn.com/course/%EC%8A%A4%ED%94%84%EB%A7%81-mvc-1',
    description: '강의 주소',
    required: false,
  })
  @IsOptional()
  @IsString()
  siteUrl: string;
}
