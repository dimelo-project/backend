import { ProjectsSkillsTags } from './ProjectsSkillsTags';
import { ProjectsPositionsTags } from './ProjectsPositionsTags';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  RelationId,
  UpdateDateColumn,
} from 'typeorm';
import { Users } from './Users';
import { ProjectsComments } from './ProjectsComments';
import { ProjectsPositions } from './ProjectsPositions';
import { ProjectsSkills } from './ProjectsSkills';
import { ApiProperty } from '@nestjs/swagger';

@Index('FK_project_user_idx', ['userId'], {})
@Index('id_UNIQUE', ['id'], { unique: true })
@Entity('projects', { schema: 'dimelo' })
export class Projects extends BaseEntity {
  @ApiProperty({
    example: 1,
    description: 'project id',
  })
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @ApiProperty({
    example: 'dimelo프로젝트 하실 개발자 구합니다',
    description: '프로젝트 제목',
  })
  @Column('varchar', { name: 'title', length: 100 })
  title: string;

  @ApiProperty({
    example: '프론트 뷰, 백엔드 노드 개발자 구합니다',
    description: '프로젝트 내용',
  })
  @Column('text', { name: 'content' })
  content: string;

  @ApiProperty({
    example: '모집중',
    description: '모집중/모집완료',
  })
  @Column('enum', { name: 'ongoing', enum: ['모집중', '모집완료'] })
  ongoing: '모집중' | '모집완료';

  @ApiProperty({
    example: '2022-01-01',
    description: '모집을 진행하는 날짜',
  })
  @Column('datetime', { name: 'duedate', nullable: true })
  duedate: Date | null;

  @ApiProperty({
    example: 2,
    description: '모집하는 참여자 수',
  })
  @Column('int', { name: 'participant', nullable: true })
  participant: number | null;

  @ApiProperty({
    example: 1,
    description: '글을 작성한 user id',
  })
  @Column('int', { name: 'user_id' })
  userId: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Users, (users) => users.Projects, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'user_id', referencedColumnName: 'id' }])
  User: Users;

  @RelationId((projects: Projects) => projects.User)
  UserId: number;

  @OneToMany(
    () => ProjectsComments,
    (projectsComments) => projectsComments.Project,
  )
  ProjectsComments: ProjectsComments[];

  @OneToMany(
    () => ProjectsPositionsTags,
    (projectsPositionsTags) => projectsPositionsTags.Project,
  )
  ProjectsPositionsTags: ProjectsPositionsTags[];

  @OneToMany(
    () => ProjectsSkillsTags,
    (projectsSkillsTags) => projectsSkillsTags.Project,
  )
  ProjectsSkillsTags: ProjectsSkillsTags[];
}
