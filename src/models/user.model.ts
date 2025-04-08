

import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class UserModel {
  @Field()
  userId: string;

  @Field()
  name: string;

  @Field()
  email: string;

  @Field({ nullable: true })
  biometricKey?: string;

  @Field()
  token: string;
}
