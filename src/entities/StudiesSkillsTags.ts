import { StudiesSkills } from './StudiesSkills';
import { Studies } from './Studies';
import {
  Column,
  JoinColumn,
  CreateDateColumn,
  ManyToOne,
  BaseEntity,
  Entity,
  RelationId,
} from 'typeorm';

@Entity('studies_skills_tags', { schema: 'dimelo' })
export class StudiesSkillsTags extends BaseEntity {
  @Column('int', { primary: true, name: 'study_id' })
  studyId: number;

  @Column('int', { primary: true, name: 'skill_id' })
  skillId: number;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => Studies, (studies) => studies.StudiesSkillsTags, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'study_id', referencedColumnName: 'id' }])
  Study: Studies;

  @RelationId((studiesSkillsTags: StudiesSkillsTags) => studiesSkillsTags.Study)
  ProjectId: number;

  @ManyToOne(
    () => StudiesSkills,
    (studiesSkills) => studiesSkills.StudiesSkillsTags,
  )
  @JoinColumn([{ name: 'skill_id', referencedColumnName: 'id' }])
  StudiesSkill: StudiesSkills;

  @RelationId(
    (studiesSkillsTags: StudiesSkillsTags) => studiesSkillsTags.StudiesSkill,
  )
  StudiesSkillId: number;
}
