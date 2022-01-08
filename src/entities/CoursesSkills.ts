import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  Entity,
  Index,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Courses } from './Courses';

@Index('id_UNIQUE', ['id'], { unique: true })
@Index('skill_UNIQUE', ['skill'], { unique: true })
@Entity('courses_skills', { schema: 'dimelo' })
export class CoursesSkills {
  @ApiProperty({
    example: 1,
    description: 'course skill id',
  })
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @ApiProperty({
    example: 'Spring',
    description: '강의에서 가르치는 기술',
  })
  @Column('varchar', { name: 'skill', unique: true, length: 45 })
  skill: string;

  @ManyToMany(() => Courses, (courses) => courses.CoursesSkills)
  Courses: Courses[];
}
