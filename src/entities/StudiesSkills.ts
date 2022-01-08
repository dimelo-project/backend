import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  Entity,
  Index,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Studies } from './Studies';

@Index('id_UNIQUE', ['id'], { unique: true })
@Index('skill_UNIQUE', ['skill'], { unique: true })
@Entity('studies_skills', { schema: 'dimelo' })
export class StudiesSkills {
  @ApiProperty({
    example: 1,
    description: 'study의 skill id',
  })
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @ApiProperty({
    example: '자바스크립트',
    description: '스터디 스킬'
  })
  @Column('varchar', { name: 'skill', unique: true, length: 45 })
  skill: string;

  @ManyToMany(() => Studies, (studies) => studies.StudiesSkills)
  @JoinTable({
    name: 'studies_skills_tags',
    joinColumns: [{ name: 'skill_id', referencedColumnName: 'id' }],
    inverseJoinColumns: [{ name: 'study_id', referencedColumnName: 'id' }],
    schema: 'dimelo',
  })
  Studies: Studies[];
}
