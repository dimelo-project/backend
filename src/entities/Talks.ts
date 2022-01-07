import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Users } from './Users';
import { TalksComments } from './TalksComments';

@Index('FK_talk_user_idx', ['userId'], {})
@Index('id_UNIQUE', ['id'], { unique: true })
@Entity('talks', { schema: 'dimelo' })
export class Talks {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('enum', {
    name: 'category',
    enum: ['개발', '데이터', '디자인', '기타'],
  })
  category: '개발' | '데이터' | '디자인' | '기타';

  @Column('varchar', { name: 'title', length: 100 })
  title: string;

  @Column('text', { name: 'content' })
  content: string;

  @Column('int', { name: 'user_id' })
  userId: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Users, (users) => users.Talks, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'user_id', referencedColumnName: 'id' }])
  User: Users;

  @OneToMany(() => TalksComments, (talksComments) => talksComments.Talk)
  TalksComments: TalksComments[];
}
