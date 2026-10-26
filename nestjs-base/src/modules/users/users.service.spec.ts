import { ConflictException, NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';

type RepoMock = jest.Mocked<
  Pick<
    Repository<User>,
    'exists' | 'create' | 'save' | 'findOne' | 'update' | 'softDelete'
  >
>;

describe('UsersService', () => {
  let service: UsersService;
  let repo: RepoMock;

  const user = Object.assign(new User(), {
    id: '5c1c8a0e-0000-4000-8000-000000000001',
    email: 'john@example.com',
    fullName: 'John Doe',
    isActive: true,
  });

  beforeEach(async () => {
    repo = {
      exists: jest.fn(),
      create: jest.fn((dto: Partial<User>) => Object.assign(new User(), dto)),
      save: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      softDelete: jest.fn(),
    } as unknown as RepoMock;

    const moduleRef = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: getRepositoryToken(User), useValue: repo },
      ],
    }).compile();

    service = moduleRef.get(UsersService);
  });

  describe('create', () => {
    it('normalizes the email and saves the user', async () => {
      repo.exists.mockResolvedValue(false);
      repo.save.mockResolvedValue(user);
      repo.findOne.mockResolvedValue(user);

      const result = await service.create({
        email: 'John@Example.com',
        fullName: 'John Doe',
      });

      const created = repo.create.mock.calls[0][0] as Partial<User>;
      expect(created.email).toBe('john@example.com');
      expect(result).toBe(user);
    });

    it('throws ConflictException when email exists', async () => {
      repo.exists.mockResolvedValue(true);
      await expect(
        service.create({
          email: 'john@example.com',
          fullName: 'John',
        }),
      ).rejects.toBeInstanceOf(ConflictException);
    });
  });

  describe('findOne', () => {
    it('returns the user', async () => {
      repo.findOne.mockResolvedValue(user);
      await expect(service.findOne(user.id)).resolves.toBe(user);
    });

    it('throws NotFoundException when missing', async () => {
      repo.findOne.mockResolvedValue(null);
      await expect(service.findOne('missing')).rejects.toBeInstanceOf(
        NotFoundException,
      );
    });
  });

  it('remove() soft-deletes the user', async () => {
    repo.findOne.mockResolvedValue(user);
    await service.remove(user.id);
    expect(repo.softDelete).toHaveBeenCalledWith(user.id);
  });
});
