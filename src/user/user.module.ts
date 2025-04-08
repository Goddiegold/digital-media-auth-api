import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { PrismaService } from 'src/prisma.service';
import { UserService } from './user.service';
import { JwtModule } from '@nestjs/jwt';
import { Config } from 'src/config';
import { DatabaseService } from 'src/database/database.service';
import { UserResolver } from './user.resolver';

@Module({
  imports: [
    JwtModule.register({
      secret: Config.JWT_SECRET,
      signOptions: { expiresIn: '1d' },
    }),
  ],
  providers: [UserService, PrismaService, DatabaseService, UserResolver],
  controllers: [UserController],
})
export class UserModule { }
