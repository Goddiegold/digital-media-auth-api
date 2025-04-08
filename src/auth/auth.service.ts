import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import {
  compareHasWithRawString,
  errorMessage,
  sha256Hash,
} from 'src/common/utils';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class AuthService {
  constructor(
    private databaseService: DatabaseService,
    private jwtService: JwtService
  ) { }

  /**
   * This function asynchronously logs in a user locally by checking if the user exists in the
   * database and validating the password.
   * @param  - This code snippet is an asynchronous function `loginUserLocal` that takes a partial user
   * object as a parameter. It attempts to log in a user by checking if the user exists in the database
   * and verifying the password provided.
   * @returns The `loginUserLocal` function is returning an object with the following properties:
   * - userId: The userId of the user retrieved from the database
   * - email: The email of the user retrieved from the database
   * - name: The email of the user retrieved from the database
   * - totken: A signed JWT token
   */
  async loginUserLocal({ user }: { user: Partial<User> }) {
    try {
      const userExists = await this.databaseService.getUser({
        userIdEmailBioKey: user.email,
      });
      // console.log('userExists', userExists);

      if (!userExists) throw new NotFoundException('User not registered!');
      const validPassword = compareHasWithRawString(
        user?.password,
        userExists?.password,
      );

      if (!validPassword)
        throw new BadRequestException('Incorrect email or password!');

      return {
        userId: userExists?.userId,
        email: userExists?.email,
        name: userExists?.email,
        token: this.jwtService.sign({ userId: userExists?.userId })
      };
    } catch (error) {
      throw new InternalServerErrorException(errorMessage(error));
    }
  }

  /**
   * The function `loginWithBioKey` takes a biometric key, hashes it, retrieves a user from the database
   * based on the hashed key, and validates the key before returning user information.
   * @param  - The `biometricKey` as a string.
   * @returns The function `loginWithBioKey` returns an object with the following properties:
   * - userId: the user's ID
   * - email: the user's email
   * - name: the user's name
   * - biometricKey: the biometric key used for login
   * - totken: A signed JWT token
   */
  async loginWithBioKey({ biometricKey }: { biometricKey: string }) {
    try {
      const biometricKeyLookup = sha256Hash(biometricKey);

      const user = await this.databaseService.getUser({
        userIdEmailBioKey: biometricKeyLookup,
      });

      if (!user) throw new NotFoundException('User not registered!');

      const validKey = compareHasWithRawString(
        biometricKey,
        user?.biometricKey,
      );
      if (!validKey)
        throw new BadRequestException(
          `Invalid biometric key [${biometricKey}]!`,
        );

      return {
        userId: user?.userId,
        email: user?.email,
        name: user?.name,
        biometricKey,
        token: this.jwtService.sign({ userId: user?.userId })
      };
    } catch (error) {
      throw new InternalServerErrorException(errorMessage(error));
    }
  }
}
