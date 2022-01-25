import { ProjectsSkillsTags } from './ProjectsSkillsTags';
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
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

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
