import { CoursesSkills } from './CoursesSkills';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  RelationId,
} from 'typeorm';
import { Courses } from './Courses';

@Entity('course_skills_tags', { schema: 'dimelo' })
export class CoursesSkillsTags extends BaseEntity {
  @Column('int', { primary: true, name: 'skill_id' })
  skillId: number;

  @Column('int', { primary: true, name: 'course_id' })
  courseId: number;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => Courses, (courses) => courses.CoursesSkillsTags, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'course_id', referencedColumnName: 'id' }])
  Course: Courses;

  @RelationId(
    (coursesSkillsTags: CoursesSkillsTags) => coursesSkillsTags.Course,
  )
  CourseId: number;

  @ManyToOne(
    () => CoursesSkills,
    (coursesSkills) => coursesSkills.CoursesSkillsTgas,
    {
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
  )
  @JoinColumn([{ name: 'skill_id', referencedColumnName: 'id' }])
  CoursesSkill: CoursesSkills;

  @RelationId(
    (coursesSkillsTags: CoursesSkillsTags) => coursesSkillsTags.CoursesSkill,
  )
  CoursesSkillId: number;
}
