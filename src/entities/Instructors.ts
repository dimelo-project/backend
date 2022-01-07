import {
  Column,
  Entity,
  Index,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Courses } from './Courses';
import { Reviews } from './Reviews';

@Index('id_UNIQUE', ['id'], { unique: true })
@Entity('instructors', { schema: 'dimelo' })
export class Instructors {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('varchar', { name: 'name', length: 100 })
  name: string;

  @ManyToMany(() => Courses, (courses) => courses.Instructors)
  Courses: Courses[];

  @OneToMany(() => Reviews, (reviews) => reviews.Instructor)
  Reviews: Reviews[];
}
