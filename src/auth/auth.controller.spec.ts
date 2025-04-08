require('dotenv').config();
import { JwtModule } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import {
  generateHashedString,
  generateRandomString,
  sha256Hash,
} from 'src/common/utils';
import { Config } from 'src/config';
import { DatabaseService } from 'src/database/database.service';
import { PrismaService } from '../prisma.service';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let authService: AuthService;
  let prisma: PrismaService;
  const mockUser = {
    email: 'test@example.com',
    password: 'password',
    name: 'Test User',
  };
  let userId = null;
  let biometricKey = null;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        JwtModule.register({
          secret: Config.JWT_SECRET,
          signOptions: { expiresIn: '1d' },
        }),
      ],
      providers: [AuthService, PrismaService, DatabaseService],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    prisma = module.get<PrismaService>(PrismaService);

    biometricKey = generateRandomString({ max: 10 });

    const newUser = await prisma.user.create({
      data: {
        ...mockUser,
        password: generateHashedString(mockUser?.password),
        biometricKeyLookup: sha256Hash(biometricKey),
        biometricKey: generateHashedString(biometricKey),
      },
    });

    userId = newUser?.userId;
  }, 20000);

  afterAll(async () => {
    if (userId) {
      await prisma.user.delete({
        where: {
          userId,
        },
      });
    }
  }, 20000);

  it('should log user with email and password', async () => {
    const result = await authService.loginUserLocal({
      user: {
        email: mockUser?.email,
        password: mockUser?.password,
      },
    });

    expect(result).toMatchObject({
      userId,
      email: mockUser.email,
      name: mockUser.name,
      token: expect.any(String),
    });
  });

  it('should log user with biometrickKey', async () => {
    const result = await authService.loginWithBioKey({
      biometricKey,
    });

    expect(result).toMatchObject({
      userId,
      email: mockUser.email,
      name: mockUser.name,
      token: expect.any(String),
    });
  });

  it('should throw error for invalid email', async () => {
    await expect(
      authService.loginUserLocal({
        user: {
          email: mockUser?.password,
          password: mockUser?.password,
        },
      }),
    ).rejects.toThrow('User not registered!');
  });

  it('should throw error for invalid passsword', async () => {
    await expect(
      authService.loginUserLocal({
        user: {
          email: mockUser?.email,
          password: mockUser?.email,
        }
      })
    ).rejects.toThrow('Incorrect email or password!');
  });

  it('should log user with biometrickKey', async () => {
    await expect(
      authService.loginWithBioKey({
        biometricKey: mockUser?.email,
      })
    ).rejects.toThrow('User not registered!');
  });

});
