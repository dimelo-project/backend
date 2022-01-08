import { ApiProperty } from '@nestjs/swagger';
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
import { Projects } from './Projects';
import { Users } from './Users';

@Index('FK_project_comment_project_idx', ['projectId'], {})
@Index('FK_project_comment_user_idx', ['userId'], {})
@Index('id_UNIQUE', ['id'], { unique: true })
@Entity('projects_comments', { schema: 'dimelo' })
export class ProjectsComments {
  @ApiProperty({
    example: 1,
    description: 'project의 comment id'
  })
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @ApiProperty({
    example: '저 할래요!',
    description: '프로젝트 댓글 내용'
  })
  @Column('text', { name: 'comment_text' })
  commentText: string;

  @ApiProperty({
    example: 1,
    description: '댓글 작성한 user id'
  })
  @Column('int', { name: 'user_id' })
  userId: number;

  @ApiProperty({
    example: 1,
    description: 'project id'
  })
  @Column('int', { name: 'project_id' })
  projectId: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Projects, (projects) => projects.ProjectsComments, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'project_id', referencedColumnName: 'id' }])
  Project: Projects;

  @ManyToOne(() => Users, (users) => users.ProjectsComments, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'user_id', referencedColumnName: 'id' }])
  User: Users;
}
