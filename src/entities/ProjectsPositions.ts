import { ApiProperty } from '@nestjs/swagger';
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
  @ApiProperty({
    example: 1,
    description: '프로젝트',
  })
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @ApiProperty({
    example: '프론트',
    description: '프로젝트 포지션'
  })
  @Column('enum', { name: 'position', enum: ['프론트', '백엔드', '기획자', '디자이너']})
  position: '프론트'|'백엔드'|'기획자'|'디자이너';

  @ManyToMany(() => Projects, (projects) => projects.ProjectsPositions)
  @JoinTable({
    name: 'projects_positions_tags',
    joinColumns: [{ name: 'position_id', referencedColumnName: 'id' }],
    inverseJoinColumns: [{ name: 'project_id', referencedColumnName: 'id' }],
    schema: 'dimelo',
  })
  Projects: Projects[];
}
