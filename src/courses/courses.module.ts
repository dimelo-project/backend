import { CoursesSkills } from './../entities/CoursesSkills';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { CoursesController } from './courses.controller';
import { CoursesService } from './courses.service';
import { Likes } from './../entities/Likes';
import { Courses } from '../entities/Courses';
import { Instructors } from '../entities/Instructors';
import { Users } from '../entities/Users';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Courses,
      Instructors,
      Likes,
      Users,
      CoursesSkills,
    ]),
  ],
  controllers: [CoursesController],
  providers: [CoursesService],
})
export class CoursesModule {}
