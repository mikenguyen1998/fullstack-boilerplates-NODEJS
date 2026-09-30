import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import type { ConfigType } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { Paginated } from '../../common/interfaces';
import { paginate } from '../../common/utils';
import { appConfig } from '../../config/app.config';
import { CreateUserDto, QueryUserDto, UpdateUserDto } from './dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    @Inject(appConfig.KEY)
    private readonly config: ConfigType<typeof appConfig>,
  ) {}

  async create(dto: CreateUserDto): Promise<User> {
    const email = dto.email.toLowerCase();
    const exists = await this.usersRepository.exists({ where: { email } });
    if (exists) throw new ConflictException('users.EMAIL_EXISTS');

    const user = this.usersRepository.create({
      ...dto,
      email,
      password: await this.hashPassword(dto.password),
    });
    const saved = await this.usersRepository.save(user);
    return this.findOne(saved.id);
  }

  async findAll(query: QueryUserDto): Promise<Paginated<User>> {
    const qb = this.usersRepository.createQueryBuilder('user');

    if (query.role) qb.andWhere('user.role = :role', { role: query.role });
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

  /** Dùng cho đăng nhập: lấy kèm password hash (cột select:false) */
  findByEmailWithPassword(email: string): Promise<User | null> {
    return this.usersRepository
      .createQueryBuilder('user')
      .addSelect('user.password')
      .where('user.email = :email', { email: email.toLowerCase() })
      .getOne();
  }

  /** Dùng cho refresh token: lấy kèm refreshTokenHash */
  findByIdWithRefreshToken(id: string): Promise<User | null> {
    return this.usersRepository
      .createQueryBuilder('user')
      .addSelect('user.refreshTokenHash')
      .where('user.id = :id', { id })
      .getOne();
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

  async setRefreshTokenHash(id: string, hash: string | null): Promise<void> {
    await this.usersRepository.update(id, { refreshTokenHash: hash });
  }

  async markLoggedIn(id: string): Promise<void> {
    await this.usersRepository.update(id, { lastLoginAt: new Date() });
  }

  hashPassword(plain: string): Promise<string> {
    return bcrypt.hash(plain, this.config.bcryptSaltRounds);
  }
}
