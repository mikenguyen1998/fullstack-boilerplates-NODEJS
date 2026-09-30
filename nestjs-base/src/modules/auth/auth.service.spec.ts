import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import * as bcrypt from 'bcrypt';
import { Role } from '../../common/enums';
import { jwtConfig } from '../../config/jwt.config';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let usersService: jest.Mocked<
    Pick<
      UsersService,
      | 'create'
      | 'findByEmailWithPassword'
      | 'findByIdWithRefreshToken'
      | 'setRefreshTokenHash'
      | 'markLoggedIn'
      | 'findOne'
    >
  >;

  const baseUser = (): User =>
    Object.assign(new User(), {
      id: 'user-id',
      email: 'john@example.com',
      fullName: 'John Doe',
      role: Role.USER,
      isActive: true,
    });

  beforeEach(async () => {
    usersService = {
      create: jest.fn(),
      findByEmailWithPassword: jest.fn(),
      findByIdWithRefreshToken: jest.fn(),
      setRefreshTokenHash: jest.fn(),
      markLoggedIn: jest.fn(),
      findOne: jest.fn(),
    };

    const moduleRef = await Test.createTestingModule({
      providers: [
        AuthService,
        JwtService,
        { provide: UsersService, useValue: usersService },
        {
          provide: jwtConfig.KEY,
          useValue: {
            accessSecret: 'test-access-secret-123456',
            accessExpiresIn: '15m',
            refreshSecret: 'test-refresh-secret-123456',
            refreshExpiresIn: '7d',
            issuer: 'test',
          },
        },
      ],
    }).compile();

    service = moduleRef.get(AuthService);
  });

  describe('validateCredentials', () => {
    it('returns the user for a correct password', async () => {
      const user = Object.assign(baseUser(), {
        password: await bcrypt.hash('Str0ngPass', 4),
      });
      usersService.findByEmailWithPassword.mockResolvedValue(user);

      await expect(
        service.validateCredentials('john@example.com', 'Str0ngPass'),
      ).resolves.toBe(user);
    });

    it('throws for a wrong password', async () => {
      const user = Object.assign(baseUser(), {
        password: await bcrypt.hash('Str0ngPass', 4),
      });
      usersService.findByEmailWithPassword.mockResolvedValue(user);

      await expect(
        service.validateCredentials('john@example.com', 'wrong'),
      ).rejects.toBeInstanceOf(UnauthorizedException);
    });

    it('throws when the user does not exist', async () => {
      usersService.findByEmailWithPassword.mockResolvedValue(null);
      await expect(
        service.validateCredentials('nobody@example.com', 'x'),
      ).rejects.toBeInstanceOf(UnauthorizedException);
    });
  });

  describe('login', () => {
    it('issues tokens, stores refresh hash and strips secrets', async () => {
      const user = Object.assign(baseUser(), { password: 'hash' });
      const res = await service.login(user);

      expect(res.accessToken).toEqual(expect.any(String));
      expect(res.refreshToken).toEqual(expect.any(String));
      expect(res.tokenType).toBe('Bearer');
      expect(res.user.password).toBeUndefined();
      expect(usersService.markLoggedIn).toHaveBeenCalledWith(user.id);
      expect(usersService.setRefreshTokenHash).toHaveBeenCalledWith(
        user.id,
        expect.any(String),
      );
    });
  });

  describe('validateRefreshToken', () => {
    it('accepts the latest issued refresh token', async () => {
      const user = baseUser();
      const { refreshToken } = await service.login(user);
      const storedHash = usersService.setRefreshTokenHash.mock.calls[0][1];
      usersService.findByIdWithRefreshToken.mockResolvedValue(
        Object.assign(baseUser(), { refreshTokenHash: storedHash }),
      );

      await expect(
        service.validateRefreshToken(user.id, refreshToken),
      ).resolves.toMatchObject({ id: user.id });
    });

    it('rejects and revokes session on token mismatch', async () => {
      usersService.findByIdWithRefreshToken.mockResolvedValue(
        Object.assign(baseUser(), {
          refreshTokenHash: await bcrypt.hash('other', 4),
        }),
      );

      await expect(
        service.validateRefreshToken('user-id', 'some.jwt.token'),
      ).rejects.toBeInstanceOf(UnauthorizedException);
      expect(usersService.setRefreshTokenHash).toHaveBeenCalledWith(
        'user-id',
        null,
      );
    });
  });
});
