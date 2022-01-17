import { ProjectsSkillsTags } from './ProjectsSkillsTags';
import { ApiProperty } from '@nestjs/swagger';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Projects } from './Projects';

@Index('id_UNIQUE', ['id'], { unique: true })
@Index('skill_UNIQUE', ['skill'], { unique: true })
@Entity('projects_skills', { schema: 'dimelo' })
export class ProjectsSkills extends BaseEntity {
  @ApiProperty({
    example: 1,
    description: 'project의 skill id',
  })
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @ApiProperty({
    example: '리액트',
    description: '프로젝트 스킬',
  })
  @Column('varchar', { name: 'skill', unique: true, length: 45 })
  skill: string;

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(
    () => ProjectsSkillsTags,
    (projectsSkillsTags) => projectsSkillsTags.ProjectsSkill,
  )
  ProjectsSkillsTags: ProjectsSkillsTags[];

  @ManyToMany(() => Projects, (projects) => projects.ProjectsSkills)
  @JoinTable({
    name: 'projects_skills_tags',
    joinColumns: [{ name: 'skill_id', referencedColumnName: 'id' }],
    inverseJoinColumns: [{ name: 'project_id', referencedColumnName: 'id' }],
    schema: 'dimelo',
  })
  Projects: Projects[];
}
