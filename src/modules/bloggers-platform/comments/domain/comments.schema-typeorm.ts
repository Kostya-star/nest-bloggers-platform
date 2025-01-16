import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { Post } from '../../posts/domain/posts.schema-typeorm';
import { User } from 'src/modules/user-accounts/users/domain/user.schema-typeorm';

export const commentContentConstraints = {
  minLength: 20,
  maxLength: 300,
};

@Entity('comments')
export class Comment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    length: commentContentConstraints.maxLength,
  })
  content: string;

  @Column({
    type: 'integer',
  })
  postId: number;

  @ManyToOne(() => Post, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  post: Post;

  @Column({ type: 'integer' })
  userId: number;

  @ManyToOne(() => User, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  user: User;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}
