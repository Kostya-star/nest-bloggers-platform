import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { LikeStatus } from '../const/like-status';
import { User } from 'src/modules/user-accounts/users/domain/user.schema-typeorm';

@Entity('likes')
export class Like {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ type: 'enum', enum: LikeStatus, nullable: false })
  status: LikeStatus;

  // __ASK__ we could not include this field?
  @Column({ type: 'integer', nullable: false })
  userId: number;

  @ManyToOne(() => User, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  @JoinColumn()
  user: User;

  @Column({ type: 'integer', nullable: false })
  likedEntityId: number;

  // @Column({ type: 'char varying', nullable: false })
  // user_login: string;

  @CreateDateColumn({ type: 'timestamptz', nullable: false })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz', nullable: false })
  updatedAt: Date;
}
