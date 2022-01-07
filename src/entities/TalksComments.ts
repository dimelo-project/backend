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
import { Users } from './Users';
import { Talks } from './Talks';

@Index('FK_talk_id_idx', ['talkId'], {})
@Index('FK_talk_user_idx', ['userId'], {})
@Entity('talks_comments', { schema: 'dimelo' })
export class TalksComments {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('varchar', { name: 'comment_text', length: 45 })
  commentText: string;

  @Column('int', { name: 'user_id' })
  userId: number;

  @Column('int', { name: 'talk_id' })
  talkId: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Users, (users) => users.TalksComments, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'user_id', referencedColumnName: 'id' }])
  User: Users;

  @ManyToOne(() => Talks, (talks) => talks.TalksComments, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'talk_id', referencedColumnName: 'id' }])
  Talk: Talks;
}
