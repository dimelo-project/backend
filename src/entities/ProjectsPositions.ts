import {
  Column,
  Entity,
  Index,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Projects } from './Projects';

@Index('id_UNIQUE', ['id'], { unique: true })
@Entity('projects_positions', { schema: 'dimelo' })
export class ProjectsPositions {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('varchar', { name: 'position', length: 45 })
  position: string;

  @ManyToMany(() => Projects, (projects) => projects.ProjectsPositions)
  @JoinTable({
    name: 'projects_positions_tags',
    joinColumns: [{ name: 'position_id', referencedColumnName: 'id' }],
    inverseJoinColumns: [{ name: 'project_id', referencedColumnName: 'id' }],
    schema: 'dimelo',
  })
  Projects: Projects[];
}
