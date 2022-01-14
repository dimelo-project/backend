import { Reviews } from './Reviews';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  RelationId,
} from 'typeorm';
import { Users } from './Users';

@Entity('review_helpes', { schema: 'dimelo' })
export class ReviewHelpes extends BaseEntity {
  @Column('int', { primary: true, name: 'user_id' })
  userId: number;

  @Column('int', { primary: true, name: 'review_id' })
  reviewId: number;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => Reviews, (reviews) => reviews.ReviewHelpes, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'review_id', referencedColumnName: 'id' }])
  Review: Reviews;

  @RelationId((reviewHelpes: ReviewHelpes) => reviewHelpes.Review)
  ReviewId: number;

  @ManyToOne(() => Users, (users) => users.ReviewHelpes, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'user_id', referencedColumnName: 'id' }])
  User: Users;

  @RelationId((reviewHelpes: ReviewHelpes) => reviewHelpes.User)
  UserId: number;
}
