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

@Index('FK_project_user_idx', ['userId'], {})
@Index('id_UNIQUE', ['id'], { unique: true })
@Entity('projects', { schema: 'dimelo' })
export class Projects extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('varchar', { name: 'title', length: 100 })
  title: string;

  @Column('text', { name: 'content' })
  content: string;

  @Column('enum', { name: 'ongoing', enum: ['모집중', '모집완료'] })
  ongoing: '모집중' | '모집완료';

  @Column('datetime', { name: 'duedate', nullable: true })
  duedate: Date | null;

  @Column('int', { name: 'participant', nullable: true })
  participant: number | null;

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

  @ManyToMany(
    () => ProjectsPositions,
    (projectsPositions) => projectsPositions.Projects,
  )
  ProjectsPositions: ProjectsPositions[];

  @ManyToMany(() => ProjectsSkills, (projectsSkills) => projectsSkills.Projects)
  ProjectsSkills: ProjectsSkills[];
}
