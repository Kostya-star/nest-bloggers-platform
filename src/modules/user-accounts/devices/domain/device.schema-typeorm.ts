import { Entity, Column } from 'typeorm';

@Entity('devices')
export class Device {
  @Column({ type: 'char varying', nullable: false })
  deviceId: string;

  @Column({ type: 'int', nullable: false })
  userId: number;

  @Column({ type: 'char varying', nullable: false })
  issuedAt: string;

  @Column({ type: 'char varying', nullable: false })
  expiresAt: string;

  @Column({ type: 'char varying', nullable: false })
  userAgent: string;

  @Column({ type: 'char varying', nullable: false })
  ipAddress: string;

  @Column({ type: 'char varying', nullable: false })
  lastActiveDate: string;
}
