import { Exclude } from 'class-transformer';
import { IsInt, IsString } from 'class-validator';
import { Link } from 'src/links/entities/link.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'link_analytic' })
export class LinkAnalytic {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  @IsString()
  device: string;

  @Column({ nullable: true })
  @IsString()
  browser: string;

  @Column({ name: 'ip_address' })
  @IsString()
  ipAddress: string;

  @Column({ nullable: true })
  @IsString()
  country: string;

  @Column({ nullable: true })
  @IsString()
  city: string;

  @ManyToOne(() => Link, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'link_id' })
  link: Link;

  @Column({ name: 'link_id' })
  linkId: number;
}
