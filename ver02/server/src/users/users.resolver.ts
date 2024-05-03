import { Resolver, Query } from '@nestjs/graphql';
import { User } from './entities/user.entity';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from 'src/auth/guards/gql.guard';
import { UsersService } from './users.service';
import { JwtToken } from 'src/common/interface';
import { CurrentUser } from 'src/auth/decorator/current-user';

@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(GqlAuthGuard)
  @Query(() => [User], { name: 'users' })
  async findAll(@CurrentUser() user: JwtToken) {
    console.log('[[UsersResolver]] > [findAll] > user._id: ', user._id);
    return this.usersService.findAll(user._id);
  }
}
