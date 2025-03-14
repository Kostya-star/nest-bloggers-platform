import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Player } from './player.schema';
import { GameStatuses } from '../dto/game-statuses';
import { GameQuestions } from './game-questions.schema';

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

  @Column({ type: 'timestamptz', nullable: true })
  startDate: Date | null;

  @Column({ type: 'timestamptz', nullable: true })
  finishDate: Date | null;

  @OneToMany(() => GameQuestions, (gameQuestion) => gameQuestion.game)
  questions: GameQuestions[];

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}
