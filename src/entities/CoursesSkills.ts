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
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('varchar', { name: 'skill', unique: true, length: 45 })
  skill: string;

  @ManyToMany(() => Courses, (courses) => courses.CoursesSkills)
  Courses: Courses[];
}
