import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Blog } from '../../blogs/domain/blogs.schema-typeorm';

export const postTitleConstraints = {
  maxLength: 30,
};

export const postDescriptionConstraints = {
  maxLength: 100,
};

export const postContentConstraints = {
  maxLength: 1000,
};

@Entity('posts')
export class Post {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ type: 'varchar', length: postTitleConstraints.maxLength, nullable: false })
  title: string;

  @Column({
    type: 'varchar',
    length: postDescriptionConstraints.maxLength,
    nullable: false,
  })
  shortDescription: string;

  @Column({ type: 'varchar', length: postContentConstraints.maxLength, nullable: false })
  content: string;

  @Column({ type: 'integer', nullable: false })
  blogId: number;

  @ManyToOne(() => Blog, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  @JoinColumn()
  blog: Blog;

  // __ASK__ just coz of the tests we must keep this field, otherwise according to the NF, we should get rid of it?
  @Column({ type: 'varchar', nullable: false })
  blogName: string;

  @CreateDateColumn({ type: 'timestamptz', nullable: false })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz', nullable: false })
  updatedAt: Date;
}
