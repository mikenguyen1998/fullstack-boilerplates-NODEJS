import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Paginated } from '../../common/interfaces';
import { paginate } from '../../common/utils';
import { CreateUserDto, QueryUserDto, UpdateUserDto } from './dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async create(dto: CreateUserDto): Promise<User> {
    const email = dto.email.toLowerCase();
    const exists = await this.usersRepository.exists({ where: { email } });
    if (exists) throw new ConflictException('users.EMAIL_EXISTS');

    const user = this.usersRepository.create({
      ...dto,
      email,
    });
    const saved = await this.usersRepository.save(user);
    return this.findOne(saved.id);
  }

  async findAll(query: QueryUserDto): Promise<Paginated<User>> {
    const qb = this.usersRepository.createQueryBuilder('user');

    if (query.search) {
      qb.andWhere('(user.email ILIKE :s OR user.fullName ILIKE :s)', {
        s: `%${query.search}%`,
      });
    }

    const [items, total] = await qb
      .orderBy('user.createdAt', query.order)
      .skip(query.skip)
      .take(query.limit)
      .getManyAndCount();

    return paginate(items, total, query.page, query.limit);
  }

  async findOne(id: string): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) throw new NotFoundException('users.NOT_FOUND');
    return user;
  }

  async update(id: string, dto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);
    if (dto.email && dto.email !== user.email) {
      const exists = await this.usersRepository.exists({
        where: { email: dto.email },
      });
      if (exists) throw new ConflictException('users.EMAIL_EXISTS');
    }
    await this.usersRepository.update(id, dto);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id);
    await this.usersRepository.softDelete(id);
  }
}
