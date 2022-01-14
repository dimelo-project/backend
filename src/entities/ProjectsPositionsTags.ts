import { ProjectsPositions } from './ProjectsPositions';
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

@Entity('projects_positions_tags', { schema: 'dimelo' })
export class ProjectsPositionsTags extends BaseEntity {
  @Column('int', { primary: true, name: 'project_id' })
  projectId: number;

  @Column('int', { primary: true, name: 'position_id' })
  positionId: number;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => Projects, (projects) => projects.ProjectsPositionsTags, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'project_id', referencedColumnName: 'id' }])
  Project: Projects;

  @RelationId(
    (projectsPositionsTags: ProjectsPositionsTags) =>
      projectsPositionsTags.Project,
  )
  ProjectId: number;

  @ManyToOne(
    () => ProjectsPositions,
    (projectsPositions) => projectsPositions.ProjectsPositionsTags,
  )
  @JoinColumn([{ name: 'position_id', referencedColumnName: 'id' }])
  ProjectsPosition: ProjectsPositions;

  @RelationId(
    (projectsPositionsTags: ProjectsPositionsTags) =>
      projectsPositionsTags.ProjectsPosition,
  )
  ProjectPositionId: number;
}
