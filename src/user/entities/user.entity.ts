import { Link } from 'src/links/entities/link.entity';
import {
  Column,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

export type UserRoleType = 'admin' | 'user';

@Entity('user')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  email: string;

  @Column({ name: 'first_name' })
  firstName: string;

  @Column({ name: 'last_name' })
  lastName: string;

  @Column()
  password: string;

  @Column({ type: 'enum', enum: ['user, admin'], default: 'user' })
  role: UserRoleType = 'user';

  @OneToMany(() => Link, (link) => link.userId)
  links: Link[];

  @DeleteDateColumn()
  deletedAt?: Date;
}
