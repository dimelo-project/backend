import { ApiProperty } from '@nestjs/swagger';
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
import { Studies } from './Studies';
import { Users } from './Users';

@Index('FK_study_comment_study_idx', ['studyId'], {})
@Index('FK_study_comment_user_idx', ['userId'], {})
@Index('id_UNIQUE', ['id'], { unique: true })
@Entity('sutdies_comments', { schema: 'dimelo' })
export class StudiesComments extends BaseEntity {
  @ApiProperty({
    example: 1,
    description: 'project의 comment id',
  })
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @ApiProperty({
    example: '저 할래요!',
    description: '스터디 댓글 내용',
  })
  @Column('text', { name: 'comment_text' })
  commentText: string;

  @ApiProperty({
    example: 1,
    description: '댓글을 작성한 user id',
  })
  @Column('int', { name: 'user_id' })
  userId: number;

  @ApiProperty({
    example: 1,
    description: '댓글을 작성한 study id',
  })
  @Column('int', { name: 'study_id' })
  studyId: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Studies, (studies) => studies.StudiesComments, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'study_id', referencedColumnName: 'id' }])
  Study: Studies;

  @RelationId((studiesComments: StudiesComments) => studiesComments.Study)
  StudyId: number;

  @ManyToOne(() => Users, (users) => users.StudiesComments, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'user_id', referencedColumnName: 'id' }])
  User: Users;

  @RelationId((studiesComments: StudiesComments) => studiesComments.User)
  UserId: number;
}
