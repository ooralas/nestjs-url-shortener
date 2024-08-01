import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsInt } from 'class-validator';
import { LinkAnalytic } from 'src/link-analytic/entities/link-analytic.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Link {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column({ default: '' })
  alias: string;

  @ApiProperty()
  @Column({ name: 'long_link' })
  longLink: string;

  @ApiProperty()
  @Column({ default: 0 })
  @IsInt()
  views: number;

  @ApiProperty()
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
