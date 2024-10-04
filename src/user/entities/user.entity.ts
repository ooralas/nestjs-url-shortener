import { Role } from 'src/common/enums/role.enum';
import { Link } from 'src/links/entities/link.entity';
import {
  Column,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

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

  @Column({ type: 'enum', enum: Role, default: Role.USER })
  role: Role = Role.USER;

  @OneToMany(() => Link, (link) => link.userId)
  links: Link[];

  @DeleteDateColumn()
  deletedAt?: Date;
}
