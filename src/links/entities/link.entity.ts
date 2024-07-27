import { IsDate, IsInt } from 'class-validator';
import { LinkAnalytic } from 'src/link-analytic/entities/link-analytic.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

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

  @OneToMany(() => LinkAnalytic, (linkAnalytic) => linkAnalytic.link)
  linkAnalytics: LinkAnalytic[];
}
