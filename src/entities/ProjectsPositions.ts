import { ProjectsPositionsTags } from './ProjectsPositionsTags';
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
@Entity('projects_positions', { schema: 'dimelo' })
export class ProjectsPositions extends BaseEntity {
  @ApiProperty({
    example: 1,
    description: '프로젝트',
  })
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @ApiProperty({
    example: '프론트',
    description: '프로젝트 포지션',
  })
  @Column('enum', {
    name: 'position',
    enum: ['프론트', '백엔드', '기획자', '디자이너'],
  })
  position: '프론트' | '백엔드' | '기획자' | '디자이너';

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
