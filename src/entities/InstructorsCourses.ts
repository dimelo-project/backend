import { Instructors } from './Instructors';
import {
  Column,
  JoinColumn,
  CreateDateColumn,
  ManyToOne,
  Entity,
  RelationId,
  BaseEntity,
} from 'typeorm';
import { Courses } from './Courses';

@Entity('instructors_courses', { schema: 'dimelo' })
export class InstructorsCourses extends BaseEntity {
  @Column('int', { primary: true, name: 'course_id' })
  courseId: number;

  @Column('int', { primary: true, name: 'instructor_id' })
  instructorId: number;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => Courses, (courses) => courses.InstructorsCourses, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'course_id', referencedColumnName: 'id' }])
  Course: Courses;

  @RelationId(
    (instructorsCourses: InstructorsCourses) => instructorsCourses.Course,
  )
  CourseId: number;

  @ManyToOne(
    () => Instructors,
    (instructors) => instructors.InstructorsCourses,
    {
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
  )
  @JoinColumn([{ name: 'instructor_id', referencedColumnName: 'id' }])
  Instructor: Instructors;

  @RelationId(
    (instructorsCourses: InstructorsCourses) => instructorsCourses.Instructor,
  )
  InstructorId: number;
}
