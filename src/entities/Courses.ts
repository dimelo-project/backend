import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CoursesSkills } from './CoursesSkills';
import { Instructors } from './Instructors';
import { Likes } from './Likes';
import { Reviews } from './Reviews';

@Index('id_UNIQUE', ['id'], { unique: true })
@Entity('courses', { schema: 'dimelo' })
export class Courses {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('varchar', { name: 'title', length: 255 })
  title: string;

  @Column('varchar', { name: 'platform', length: 100 })
  platform: string;

  @Column('varchar', { name: 'category_big', length: 45 })
  categoryBig: string;

  @Column('varchar', { name: 'category_small', length: 45 })
  categorySmall: string;

  @Column('int', { name: 'price' })
  price: number;

  @Column('varchar', { name: 'site_url', length: 45 })
  siteUrl: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToMany(() => CoursesSkills, (coursesSkills) => coursesSkills.Courses)
  @JoinTable({
    name: 'courses_skills_tags',
    joinColumns: [{ name: 'course_id', referencedColumnName: 'id' }],
    inverseJoinColumns: [{ name: 'skill_id', referencedColumnName: 'id' }],
    schema: 'dimelo',
  })
  CoursesSkills: CoursesSkills[];

  @ManyToMany(() => Instructors, (instructors) => instructors.Courses)
  @JoinTable({
    name: 'instructors_courses',
    joinColumns: [{ name: 'course_id', referencedColumnName: 'id' }],
    inverseJoinColumns: [{ name: 'instructor_id', referencedColumnName: 'id' }],
    schema: 'dimelo',
  })
  Instructors: Instructors[];

  @OneToMany(() => Likes, (likes) => likes.Course)
  Likes: Likes[];

  @OneToMany(() => Reviews, (reviews) => reviews.Course)
  Reviews: Reviews[];
}
