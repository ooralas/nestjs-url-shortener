import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateLinkDto } from './dto/create-link.dto';
import { UpdateLinkDto } from './dto/update-link.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Link } from './entities/link.entity';
import { randomBytes } from 'crypto';

@Injectable()
export class LinksService {
  constructor(
    @InjectRepository(Link) private linkRepository: Repository<Link>,
  ) {}
  async create(createLinkDto: CreateLinkDto) {
    const alias = this.generateAlias(+process.env.ALIAS_LENGTH);

    const linkWithSameAlias = await this.linkRepository.findOne({
      where: [{ alias }, { longLink: createLinkDto.longLink }],
    });

    if (linkWithSameAlias) {
      return linkWithSameAlias;
    }

    createLinkDto.alias = alias;
    return await this.linkRepository.save(createLinkDto);
  }

  async findAll() {
    return await this.linkRepository.find();
  }

  async findOneById(id: number) {
    return await this.linkRepository.findOne({
      where: {
        id,
      },
    });
  }

  async findOneByAlias(alias: string) {
    const result = await this.linkRepository.findOneBy({ alias });

    if (!result) {
      throw new NotFoundException();
    }
    result.views++;

    this.update(result.id, result);
    return result;
  }

  async update(id: number, updateLinkDto: UpdateLinkDto) {
    const result = await this.linkRepository.update(id, updateLinkDto);
    if (result.affected === 0) {
      throw new NotFoundException();
    }
    return await this.findOneById(id);
  }

  async remove(id: number) {
    const result = await this.linkRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException();
    }
  }

  private generateAlias(length: number): string {
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const digits = '0123456789';

    const charPool =
      lowercase.repeat(4) + uppercase.repeat(2) + digits.repeat(2);
    const poolLength = charPool.length;

    let alias = '';
    const randomBuffer = randomBytes(length);

    for (let i = 0; i < length; i++) {
      const randomIndex = randomBuffer[i] % poolLength;
      alias += charPool[randomIndex];
    }

    return alias;
  }
}
