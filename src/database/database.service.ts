import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class DatabaseService {
  constructor(private prisma: PrismaService) {}
  async createUser({ payload }: { payload: User }) {
    const newUser = await this.prisma.user.create({
      data: {
        ...payload,
      },
    });

    return newUser;
  }

  async getUser({ userIdEmailBioKey }: { userIdEmailBioKey: string }) {


    const user = await this.prisma.user.findFirst({
      where: {
        OR:[
          { email: userIdEmailBioKey },
          { userId: userIdEmailBioKey },
          { biometricKeyLookup: userIdEmailBioKey },
        ]
      },
    });

    return user;
  }

  async updateUser({
    userId,
    payload,
  }: {
    userId: string;
    payload: Partial<User>;
  }) {
    const updatedUser = await this.prisma.user.update({
      where: {
        userId,
      },
      data: {
        ...payload,
      },
    });

    return updatedUser;
  }
}
