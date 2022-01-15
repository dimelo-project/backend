import { ReviewHelpes } from './ReviewHelpes';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  RelationId,
  UpdateDateColumn,
} from 'typeorm';
import { Users } from './Users';
import { Courses } from './Courses';
import { Instructors } from './Instructors';
import { ApiProperty } from '@nestjs/swagger';
@Index('FK_review_course_idx', ['courseId'], {})
@Index('FK_review_instructor_idx', ['instructorId'], {})
@Index('FK_review_user_idx', ['userId'], {})
@Index('id_UNIQUE', ['id'], { unique: true })
@Entity('reviews', { schema: 'dimelo' })
export class Reviews extends BaseEntity {
  @ApiProperty({
    example: 1,
    description: 'review id',
  })
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @ApiProperty({
    example: 1,
    description: '리뷰를 적을 course id',
  })
  @Column('int', { name: 'course_id' })
  courseId: number;

  @ApiProperty({
    example: 1,
    description: '리뷰를 적는 강의의 instructor id',
  })
  @Column('int', { name: 'instructor_id' })
  instructorId: number;

  @ApiProperty({
    example: 1,
    description: '작성자의 user id',
  })
  @Column('int', { name: 'user_id' })
  userId: number;

  @ApiProperty({
    example: 5,
    description: '1-5 중의 점수',
  })
  @Column('int', { name: 'q1' })
  q1: number;

  @ApiProperty({
    example: 5,
    description: '1-5 중의 점수',
  })
  @Column('int', { name: 'q2' })
  q2: number;

  @ApiProperty({
    example: 4,
    description: '1-5 중의 점수',
  })
  @Column('int', { name: 'q3' })
  q3: number;

  @ApiProperty({
    example: 3,
    description: '1-5 중의 점수',
  })
  @Column('int', { name: 'q4' })
  q4: number;

  @ApiProperty({
    example: 4.5,
    description: 'q1-q4의 평균 점수',
  })
  @Column('decimal', { name: 'avg', precision: 2, scale: 1 })
  avg: string;

  @ApiProperty({
    example: '좋아요 들으세요',
    description: '강의의 장점',
  })
  @Column('text', { name: 'pros' })
  pros: string;

  @ApiProperty({
    example: '별로에요 듣지마세요',
    description: '강의의 단점',
  })
  @Column('text', { name: 'cons' })
  cons: string;

  @ApiProperty({
    example: 5,
    description: '리뷰가 도움됨을 받은 수',
  })
  @Column('int', { name: 'helped', nullable: true, default: () => "'0'" })
  helped: number | null;

  @CreateDateColumn()
  createdAt: Date | null;

  @UpdateDateColumn()
  updatedAt: Date | null;

  @OneToMany(() => ReviewHelpes, (reviewHelpes) => reviewHelpes.Review)
  ReviewHelpes: ReviewHelpes[];

  @ManyToOne(() => Courses, (courses) => courses.Reviews, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'course_id', referencedColumnName: 'id' }])
  Course: Courses;

  @RelationId((reviews: Reviews) => reviews.Course)
  CourseId: number;

  @ManyToOne(() => Instructors, (instructors) => instructors.Reviews, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'instructor_id', referencedColumnName: 'id' }])
  Instructor: Instructors;

  @RelationId((reviews: Reviews) => reviews.Instructor)
  InstructorId: number;

  @ManyToOne(() => Users, (users) => users.Reviews, {
    onDelete: 'NO ACTION',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'user_id', referencedColumnName: 'id' }])
  User: Users;

  @RelationId((reviews: Reviews) => reviews.User)
  UserId: number;

  @ManyToMany(() => Users, (users) => users.Help)
  @JoinTable({
    name: 'review_helpes',
    joinColumns: [{ name: 'review_id', referencedColumnName: 'id' }],
    inverseJoinColumns: [{ name: 'user_id', referencedColumnName: 'id' }],
    schema: 'dimelo',
  })
  Users: Users[];
}
