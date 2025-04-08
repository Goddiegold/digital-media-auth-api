import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import {
  errorMessage,
  generateHashedString,
  generateRandomString,
  sha256Hash,
} from 'src/common/utils';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class UserService {
  constructor(
    private databaseService: DatabaseService,
    private jwtService: JwtService
  ) { }

  /**
   * This function creates a new user in a database with hashed password and biometric key,
   * handling errors appropriately.
   * @param  - The `createUser` function is an asynchronous function that creates a new user in a
   * database. Here's a breakdown of the process:
   * @returns The function `createUser` is returning an object with the following properties:
   * - userId: The user's unique identifier
   * - name: The user's name
   * - email: The user's email address
   * - biometricKey: A randomly generated string used as a biometric key
   * - totken: A signed JWT token
   */
  async createUser({ user }: { user: Partial<User> }) {
    try {
      const userExists = await this.databaseService.getUser({
        userIdEmailBioKey: user?.email,
      });

      if (userExists) throw new BadRequestException('User already registered!');
      const randomStringForBioKey = generateRandomString({ max: 10 });

      const password = generateHashedString(user.password);
      const biometricKey = generateHashedString(randomStringForBioKey);

      const biometricKeyLookup = sha256Hash(randomStringForBioKey);

      const newUser = await this.databaseService.createUser({
        payload: {
          ...user,
          biometricKey,
          biometricKeyLookup,
          password,
        } as User,
      });

      return {
        userId: newUser?.userId,
        name: newUser?.name,
        email: newUser?.email,
        biometricKey: randomStringForBioKey,
        token: this.jwtService.sign({ userId: newUser?.userId })
      };
    } catch (error) {
      throw new InternalServerErrorException(errorMessage(error));
    }
  }
}
