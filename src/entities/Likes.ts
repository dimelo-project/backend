import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  RelationId,
} from 'typeorm';
import { Courses } from './Courses';
import { Users } from './Users';

@Index('FK_like_course_idx', ['courseId'], {})
@Entity('likes', { schema: 'dimelo' })
export class Likes extends BaseEntity {
  @Column('int', { primary: true, name: 'user_id' })
  userId: number;

  @Column('int', { primary: true, name: 'course_id' })
  courseId: number;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => Courses, (courses) => courses.Likes, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'course_id', referencedColumnName: 'id' }])
  Course: Courses;

  @RelationId((likes: Likes) => likes.Course)
  CourseId: number;

  @ManyToOne(() => Users, (users) => users.Likes, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'user_id', referencedColumnName: 'id' }])
  User: Users;

  @RelationId((likes: Likes) => likes.User)
  UserId: number;
}
