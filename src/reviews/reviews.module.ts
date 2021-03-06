import { MailModule } from './../mail/mail.module';
import { Courses } from './../entities/Courses';
import { Instructors } from './../entities/Instructors';
import { ReviewHelpes } from './../entities/ReviewHelpes';
import { Reviews } from './../entities/Reviews';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { ReviewsController } from './reviews.controller';
import { ReviewsService } from './reviews.service';
import { Users } from '../entities/Users';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Reviews,
      Users,
      ReviewHelpes,
      Instructors,
      Courses,
    ]),
    MailModule,
  ],
  controllers: [ReviewsController],
  providers: [ReviewsService],
})
export class ReviewsModule {}
