import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  RelationId,
  UpdateDateColumn,
} from 'typeorm';
import { Users } from './Users';
import { Talks } from './Talks';
import { ApiProperty } from '@nestjs/swagger';

@Index('FK_talk_id_idx', ['talkId'], {})
@Index('FK_talk_user_idx', ['userId'], {})
@Entity('talks_comments', { schema: 'dimelo' })
export class TalksComments extends BaseEntity {
  @ApiProperty({
    example: 1,
    description: 'talk comment id',
  })
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @ApiProperty({
    example: '이거 추천합니다',
    description: '자유게시판 글 댓글',
  })
  @Column('varchar', { name: 'comment_text', length: 45 })
  commentText: string;

  @ApiProperty({
    example: 1,
    description: '자유게시판 댓글 작성자 user id',
  })
  @Column('int', { name: 'user_id' })
  userId: number;

  @ApiProperty({
    example: 1,
    description: 'talk id',
  })
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

  @RelationId((talksComments: TalksComments) => talksComments.User)
  UserId: number;

  @ManyToOne(() => Talks, (talks) => talks.TalksComments, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'talk_id', referencedColumnName: 'id' }])
  Talk: Talks;

  @RelationId((talksComments: TalksComments) => talksComments.Talk)
  TalkId: number;
}
