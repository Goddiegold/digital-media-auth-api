import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { UserModel } from 'src/models';
import { AuthService } from './auth.service';

@Resolver()
export class AuthResolver {
  constructor(private authService: AuthService) {}

  @Mutation(() => UserModel)
  async login(
    @Args('email') email: string,
    @Args('password') password: string,
  ) {
    const user = await this.authService.loginUserLocal({
      user: {
        email,
        password,
      },
    });
    return user;
  }

  @Mutation(() => UserModel)
  async loginWithBiometricKey(@Args('biometricKey') biometricKey: string) {
    const user = await this.authService.loginWithBioKey({ biometricKey });
    return user;
  }
}
