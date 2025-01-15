import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export const blogNameConstraints = {
  maxLength: 15,
};

export const blogDescriptionConstraints = {
  maxLength: 500,
};

export const blogWebsiteUrlConstraints = {
  match: /^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/,
  maxLength: 100,
};

@Entity('blogs')
export class Blog {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ type: 'varchar', length: blogNameConstraints.maxLength, nullable: false })
  name: string;

  @Column({ type: 'varchar', length: blogDescriptionConstraints.maxLength, nullable: false })
  description: string;

  @Column({ type: 'varchar', length: blogWebsiteUrlConstraints.maxLength, nullable: false })
  websiteUrl: string;

  @Column({ type: 'boolean', default: false, nullable: false })
  isMembership: boolean;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}
