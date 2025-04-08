import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { UserService } from './user.service';
import { UserModel } from 'src/models';

@Resolver()
export class UserResolver {
  constructor(private userService: UserService) { }

  @Query(() => String)
  sayHello(): string {
    return 'Hello from GraphQL';
  }

  @Mutation(() => UserModel)
  async register(
    @Args('email') email: string,
    @Args('password') password: string,
    @Args('name') name: string
  ) {
    const user = await this.userService.createUser({
      user: {
        email,
        password,
        name
      },
    });
    return user;
  }

  //   @Mutation(() => String)
  //   async login(
  //     @Args('email') email: string,
  //     @Args('password') password: string,
  //   ) {
  //     return this.userService.login(email, password);
  //   }

  //   @Mutation(() => String)
  //   async biometricLogin(@Args('biometricKey') biometricKey: string) {
  //     return this.userService.biometricLogin(biometricKey);
  //   }
}
