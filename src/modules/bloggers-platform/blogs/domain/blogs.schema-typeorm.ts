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

  @Column({ type: 'char varying', length: blogNameConstraints.maxLength, nullable: false })
  name: string;

  @Column({ type: 'char varying', length: blogDescriptionConstraints.maxLength, nullable: false })
  description: string;

  @Column({ type: 'char varying', length: blogWebsiteUrlConstraints.maxLength, nullable: false })
  website_url: string;

  @Column({ type: 'boolean', default: false })
  is_membership: boolean;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date;
}
