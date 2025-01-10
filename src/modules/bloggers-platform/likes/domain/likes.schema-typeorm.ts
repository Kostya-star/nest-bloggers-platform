import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { LikeStatus } from '../const/like-status';

@Entity('likes')
export class Like {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ type: 'enum', enum: LikeStatus, nullable: false })
  status: LikeStatus;

  // __ASK__ this should be a forign key, right?
  @Column({ type: 'integer', nullable: false })
  user_id: number;

  // __ASK__ should i make it a foreign key on the db lvl? NOTE - it links to several entities in db
  @Column({ type: 'integer', nullable: false })
  liked_entity_id: number;

  // __ASK__ should i make it a foreign key on the db lvl?
  @Column({ type: 'char varying', nullable: false })
  user_login: string;

  @CreateDateColumn({ type: 'timestamptz', nullable: false })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz', nullable: false })
  updated_at: Date;
}
