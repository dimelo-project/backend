import { CoursesCategories } from './CoursesCategories';
import { Courses } from './Courses';
import { ApiProperty } from '@nestjs/swagger';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('categories', { schema: 'dimelo' })
export class Categories extends BaseEntity {
  @ApiProperty({
    example: 1,
    description: 'category id',
  })
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @ApiProperty({
    example: '웹개발',
    description: '강의 작은 카테고리',
  })
  @Column('varchar', { name: 'category', unique: true, length: 45 })
  category: string;

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(
    () => CoursesCategories,
    (coursesCategories) => coursesCategories.Category,
  )
  CoursesCategories: CoursesCategories[];

  @ManyToMany(() => Courses, (courses) => courses.CoursesSkills)
  Courses: Courses[];
}
