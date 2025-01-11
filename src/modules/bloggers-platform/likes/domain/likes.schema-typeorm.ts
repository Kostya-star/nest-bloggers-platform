import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { LikeStatus } from '../const/like-status';

@Entity('likes')
export class Like {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ type: 'enum', enum: LikeStatus, nullable: false })
  status: LikeStatus;

  @Column({ type: 'integer', nullable: false })
  user_id: number;

  @Column({ type: 'integer', nullable: false })
  liked_entity_id: number;

  // @Column({ type: 'char varying', nullable: false })
  // user_login: string;

  @CreateDateColumn({ type: 'timestamptz', nullable: false })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz', nullable: false })
  updated_at: Date;
}
