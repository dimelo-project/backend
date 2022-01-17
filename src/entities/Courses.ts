import { CoursesCategories } from './CoursesCategories';
import { CoursesSkillsTags } from './CoursesSkillsTags';
import { ApiProperty } from '@nestjs/swagger';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinTable,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Likes } from './Likes';
import { Reviews } from './Reviews';
import { Instructors } from './Instructors';
import { CoursesSkills } from './CoursesSkills';
import { Categories } from './Categories';

@Index('id_UNIQUE', ['id'], { unique: true })
@Entity('courses', { schema: 'dimelo' })
export class Courses extends BaseEntity {
  @ApiProperty({
    example: 1,
    description: 'course id',
  })
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @ApiProperty({
    example: '스프링 MVC 1편 - 백엔드 웹 개발 핵심 기술',
    description: '강의 제목',
  })
  @Column('varchar', { name: 'title', length: 255 })
  title: string;

  @ApiProperty({
    example: '인프런',
    description: '강의가 있는 플랫폼',
  })
  @Column('varchar', { name: 'platform', length: 100 })
  platform: string;

  @ApiProperty({
    example: '개발',
    description: '강의 큰 카테고리',
  })
  @Column('enum', {
    name: 'category_big',
    enum: ['개발', '데이터 과학', '디자인'],
  })
  categoryBig: '개발' | '데이터 과학' | '디자인';

  @ApiProperty({
    example: 99000,
    description: '강의 가격',
  })
  @Column('int', { name: 'price' })
  price: number;

  @ApiProperty({
    example:
      'https://www.inflearn.com/course/%EC%8A%A4%ED%94%84%EB%A7%81-mvc-1',
    description: '강의 주소',
  })
  @Column('varchar', { name: 'site_url', length: 45 })
  siteUrl: string;

  @Column('int', { primary: true, name: 'instructor_id' })
  instructorId: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Likes, (likes) => likes.Course)
  Likes: Likes[];

  @OneToMany(() => Reviews, (reviews) => reviews.Course)
  Reviews: Reviews[];

  @OneToMany(
    () => CoursesSkillsTags,
    (coursesSkillsTags) => coursesSkillsTags.Course,
  )
  CoursesSkillsTags: CoursesSkillsTags[];

  @ManyToMany(() => CoursesSkills, (coursesSkills) => coursesSkills.Courses)
  @JoinTable({
    name: 'courses_skills_tags',
    joinColumns: [{ name: 'course_id', referencedColumnName: 'id' }],
    inverseJoinColumns: [{ name: 'skill_id', referencedColumnName: 'id' }],
    schema: 'dimelo',
  })
  CoursesSkills: CoursesSkills[];

  @ManyToOne(() => Instructors, (instructors) => instructors.Courses, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'instructor_id', referencedColumnName: 'id' }])
  Instructor: Instructors;

  @OneToMany(
    () => CoursesCategories,
    (coursesCategories) => coursesCategories.Course,
  )
  CoursesCategories: CoursesCategories[];

  @ManyToMany(() => Categories, (categories) => categories.Courses)
  @JoinTable({
    name: 'courses_categories',
    joinColumns: [{ name: 'course_id', referencedColumnName: 'id' }],
    inverseJoinColumns: [{ name: 'category_id', referencedColumnName: 'id' }],
    schema: 'dimelo',
  })
  Categories: Categories[];
}
