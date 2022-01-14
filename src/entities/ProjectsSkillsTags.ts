import { ProjectsSkills } from './ProjectsSkills';
import { Projects } from './Projects';
import {
  Column,
  JoinColumn,
  CreateDateColumn,
  ManyToOne,
  BaseEntity,
  Entity,
  RelationId,
} from 'typeorm';

@Entity('projects_skills_tags', { schema: 'dimelo' })
export class ProjectsSkillsTags extends BaseEntity {
  @Column('int', { primary: true, name: 'project_id' })
  projectId: number;

  @Column('int', { primary: true, name: 'skill_id' })
  skillId: number;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => Projects, (projects) => projects.ProjectsSkillsTags, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'project_id', referencedColumnName: 'id' }])
  Project: Projects;

  @RelationId(
    (projectsSkillsTags: ProjectsSkillsTags) => projectsSkillsTags.Project,
  )
  ProjectId: number;

  @ManyToOne(
    () => ProjectsSkills,
    (projectsSkills) => projectsSkills.ProjectsSkillsTags,
  )
  @JoinColumn([{ name: 'skill_id', referencedColumnName: 'id' }])
  ProjectsSkill: ProjectsSkills;

  @RelationId(
    (projectsSkillsTags: ProjectsSkillsTags) =>
      projectsSkillsTags.ProjectsSkill,
  )
  ProjectsSkillId: number;
}
