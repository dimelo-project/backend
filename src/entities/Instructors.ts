import { InstructorsCourses } from './InstructorsCourses';
import { ApiProperty } from '@nestjs/swagger';
import {
  BaseEntity,
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
export class Instructors extends BaseEntity {
  @ApiProperty({
    example: 1,
    description: 'instructor id',
  })
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @ApiProperty({
    example: '김영한',
    description: '강사 이름',
  })
  @Column('varchar', { name: 'name', length: 100 })
  name: string;

  @OneToMany(
    () => InstructorsCourses,
    (InstructorsCourses) => InstructorsCourses.Instructor,
  )
  InstructorsCourses: InstructorsCourses[];

  @OneToMany(() => Reviews, (reviews) => reviews.Instructor)
  Reviews: Reviews[];
}
