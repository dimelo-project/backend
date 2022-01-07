import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Users } from './Users';
import { Courses } from './Courses';
import { Instructors } from './Instructors';

@Index('FK_review_course_idx', ['courseId'], {})
@Index('FK_review_instructor_idx', ['instructorId'], {})
@Index('FK_review_user_idx', ['userId'], {})
@Index('id_UNIQUE', ['id'], { unique: true })
@Entity('reviews', { schema: 'dimelo' })
export class Reviews {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('int', { name: 'course_id' })
  courseId: number;

  @Column('int', { name: 'instructor_id' })
  instructorId: number;

  @Column('int', { name: 'user_id' })
  userId: number;

  @Column('int', { name: 'q1' })
  q1: number;

  @Column('int', { name: 'q2' })
  q2: number;

  @Column('int', { name: 'q3' })
  q3: number;

  @Column('int', { name: 'q4' })
  q4: number;

  @Column('decimal', { name: 'avg', precision: 2, scale: 1 })
  avg: string;

  @Column('text', { name: 'pros' })
  pros: string;

  @Column('text', { name: 'cons' })
  cons: string;

  @Column('int', { name: 'helped', nullable: true, default: () => "'0'" })
  helped: number | null;

  @CreateDateColumn()
  createdAt: Date | null;

  @UpdateDateColumn()
  updatedAt: Date | null;

  @ManyToMany(() => Users, (users) => users.Reviews2)
  @JoinTable({
    name: 'review_helped',
    joinColumns: [{ name: 'review_id', referencedColumnName: 'id' }],
    inverseJoinColumns: [{ name: 'user_id', referencedColumnName: 'id' }],
    schema: 'dimelo',
  })
  Users: Users[];

  @ManyToOne(() => Courses, (courses) => courses.Reviews, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'course_id', referencedColumnName: 'id' }])
  Course: Courses;

  @ManyToOne(() => Instructors, (instructors) => instructors.Reviews, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'instructor_id', referencedColumnName: 'id' }])
  Instructor: Instructors;

  @ManyToOne(() => Users, (users) => users.Reviews, {
    onDelete: 'NO ACTION',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'user_id', referencedColumnName: 'id' }])
  User: Users;
}
