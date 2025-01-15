import { Entity, Column, PrimaryColumn, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { User } from '../../users/domain/user.schema-typeorm';

@Entity('devices')
export class Device {
  @PrimaryColumn({ type: 'uuid', nullable: false })
  deviceId: string;

  @Column({ type: 'int', nullable: false })
  userId: number;

  @ManyToOne(() => User, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  user: User;

  @Column({ type: 'timestamptz', nullable: false })
  issuedAt: Date;

  @Column({ type: 'timestamptz', nullable: false })
  expiresAt: Date;

  @Column({ type: 'varchar', nullable: false })
  userAgent: string;

  @Column({ type: 'varchar', nullable: false })
  ipAddress: string;

  @Column({ type: 'timestamptz', nullable: false })
  lastActiveDate: Date;

  @CreateDateColumn({
    type: 'timestamptz',
    nullable: false,
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamptz',
    nullable: false,
  })
  updatedAt: Date;
}
