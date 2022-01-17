import { Categories } from './Categories';
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

@Entity('courses_categories', { schema: 'dimelo' })
export class CoursesCategories extends BaseEntity {
  @Column('int', { primary: true, name: 'category_id' })
  categoryId: number;

  @Column('int', { primary: true, name: 'course_id' })
  courseId: number;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => Courses, (courses) => courses.CoursesCategories, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'course_id', referencedColumnName: 'id' }])
  Course: Courses;

  @RelationId(
    (coursesCategories: CoursesCategories) => coursesCategories.Course,
  )
  CourseId: number;

  @ManyToOne(() => Categories, (categories) => categories.CoursesCategories, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'category_id', referencedColumnName: 'id' }])
  Category: Categories;

  @RelationId(
    (coursesCategories: CoursesCategories) => coursesCategories.Category,
  )
  CategoryId: number;
}
