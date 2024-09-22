import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';

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

    await this.userRepository.save(newUser);
  }

  findAll(includeLinks: Boolean) {
    return this.userRepository.find({
      relations: includeLinks ? ['links'] : [],
    });
  }

  async findOne(id: string, includeLinks: Boolean = false) {
    const result = await this.userRepository.findOne({
      where: {
        id,
      },
      relations: includeLinks ? ['link'] : [],
    });

    if (!result) throw new NotFoundException();
    return result;
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
