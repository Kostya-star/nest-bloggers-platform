import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Player } from './player.schema';
import { GameStatuses } from '../api/input-dto/game-statuses';

@Entity('game')
export class Game {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => Player, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  @JoinColumn({ name: 'firstPlayerId' })
  firstPlayer: Player;

  @Column({ type: 'integer' })
  firstPlayerId: number;

  @OneToOne(() => Player, { onDelete: 'CASCADE', onUpdate: 'CASCADE', nullable: true })
  @JoinColumn({ name: 'secondPlayerId' })
  secondPlayer: Player | null;

  @Column({ type: 'integer', nullable: true })
  secondPlayerId: number | null;

  @Column({ type: 'enum', enum: GameStatuses })
  status: GameStatuses;

  // @Column({ type: 'json' })
  // questions: number[];

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}
