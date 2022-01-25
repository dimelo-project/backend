import { ProjectsPositionsTags } from './ProjectsPositionsTags';
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
@Entity('projects_positions', { schema: 'dimelo' })
export class ProjectsPositions extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('varchar', { name: 'position', unique: true, length: 45 })
  position: string | null;

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(
    () => ProjectsPositionsTags,
    (projectsPositionsTags) => projectsPositionsTags.ProjectsPosition,
  )
  ProjectsPositionsTags: ProjectsPositionsTags[];

  @ManyToMany(() => Projects, (projects) => projects.ProjectsPositions)
  @JoinTable({
    name: 'projects_positions_tags',
    joinColumns: [{ name: 'position_id', referencedColumnName: 'id' }],
    inverseJoinColumns: [{ name: 'project_id', referencedColumnName: 'id' }],
    schema: 'dimelo',
  })
  Projects: Projects[];
}
