import { IsDate, IsInt } from 'class-validator';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Link {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: '' })
  alias: string;

  @Column({ name: 'long_link' })
  longLink: string;

  @Column({ default: 0 })
  @IsInt()
  views: number;

  @Column({
    name: 'created_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  @IsDate()
  createdAt: number;
}
