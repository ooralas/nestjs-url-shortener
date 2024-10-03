import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const newUser = new User();

    newUser.email = createUserDto.email;
    newUser.firstName = createUserDto.firstName;
    newUser.lastName = createUserDto.lastName;

    const hashedPassword = await bcrypt.hash(createUserDto.password, 6);
    newUser.password = hashedPassword;
    await this.userRepository.save(newUser);
  }

  findAll(includeLinks: boolean) {
    return this.userRepository.find({
      relations: includeLinks ? ['links'] : [],
    });
  }

  async findOne(id: string, includeLinks: boolean = false) {
    const result = await this.userRepository.findOne({
      where: {
        id,
      },
      relations: includeLinks ? ['link'] : [],
    });

    if (!result) throw new NotFoundException();
    return result;
  }

  async findOneByEmail(email: string): Promise<User> {
    const user = await this.userRepository.findOneBy({ email });
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.findOne(id);
    if (!user) throw new NotFoundException();

    this.userRepository.update(id, updateUserDto);
  }

  remove(id: string) {
    return this.userRepository.softDelete(id);
  }
}
