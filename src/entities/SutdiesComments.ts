import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Studies } from './Studies';
import { Users } from './Users';

@Index('FK_study_comment_study_idx', ['studyId'], {})
@Index('FK_study_comment_user_idx', ['userId'], {})
@Index('id_UNIQUE', ['id'], { unique: true })
@Entity('sutdies_comments', { schema: 'dimelo' })
export class SutdiesComments {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('text', { name: 'comment_text' })
  commentText: string;

  @Column('int', { name: 'user_id' })
  userId: number;

  @Column('int', { name: 'study_id' })
  studyId: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Studies, (studies) => studies.SutdiesComments, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'study_id', referencedColumnName: 'id' }])
  Study: Studies;

  @ManyToOne(() => Users, (users) => users.SutdiesComments, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'user_id', referencedColumnName: 'id' }])
  User: Users;
}
