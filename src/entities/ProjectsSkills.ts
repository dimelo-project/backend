import { ProjectsSkillsTags } from './ProjectsSkillsTags';
import { ApiProperty } from '@nestjs/swagger';
import {
  BaseEntity,
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

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

  @OneToMany(
    () => ProjectsSkillsTags,
    (projectsSkillsTags) => projectsSkillsTags.ProjectsSkill,
  )
  ProjectsSkillsTags: ProjectsSkillsTags[];
}
