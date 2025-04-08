require('dotenv').config();
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../prisma.service';
import { UserService } from './user.service';
import { JwtModule } from '@nestjs/jwt';
import { Config } from 'src/config';
import { DatabaseService } from 'src/database/database.service';

describe('UserService', () => {
  let userService: UserService;
  let prisma: PrismaService;
  const mockUser = {
    email: 'test@example.com',
    password: 'password',
    name: 'Test User',
  };
  let userId = null;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        JwtModule.register({
          secret: Config.JWT_SECRET,
          signOptions: { expiresIn: '1d' },
        }),
      ],
      providers: [UserService, PrismaService, DatabaseService],
    }).compile();

    userService = module.get<UserService>(UserService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  afterAll(async () => {
    if (userId) {
      await prisma.user.delete({
        where: {
          userId,
        },
      });
    }
  }, 20000);

  it('should register a new user', async () => {
    const result = await userService.createUser({
      user: {
        ...mockUser
      },
    });

    userId = result?.userId;

    expect(result).toMatchObject({
      userId,
      email: mockUser.email,
      name: mockUser.name,
    });
  });

  it('should throw error if email is already registered', async () => {
    await expect(
      userService.createUser({
        user: {
          ...mockUser
        },
      }),
    ).rejects.toThrow('User already registered!');

  });
});
