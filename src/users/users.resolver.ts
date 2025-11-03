import { PrismaService } from 'nestjs-prisma';
import {
  Resolver,
  Query,
  Parent,
  Mutation,
  Args,
  ResolveField,
} from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { UserEntity } from '../common/decorators/user.decorator';
import { GqlAuthGuard } from '../auth/gql-auth.guard';
import { UsersService } from './users.service';
import { User } from './models/user.model';
import { ChangePasswordInput } from './dto/change-password.input';
import { UpdateUserInput } from './dto/update-user.input';

/**
 * 用户解析器
 * 处理用户相关的 GraphQL 请求，需要用户认证
 */
@Resolver(() => User)
@UseGuards(GqlAuthGuard) // 应用 GraphQL 认证守卫
export class UsersResolver {
  constructor(
    // 用户服务，用于处理用户业务逻辑
    private usersService: UsersService,
    // Prisma 服务，用于数据库操作
    private prisma: PrismaService,
  ) {}

  /**
   * 获取当前用户信息
   * 返回当前认证的用户对象
   * @param user 从装饰器获取的当前用户
   * @returns 当前用户对象
   */
  @Query(() => User)
  async me(@UserEntity() user: User): Promise<User> {
    return user;
  }

  /**
   * 更新用户信息
   * 更新当前认证用户的信息
   * @param user 当前认证用户
   * @param newUserData 新的用户数据
   * @returns 更新后的用户对象
   */
  @UseGuards(GqlAuthGuard)
  @Mutation(() => User)
  async updateUser(
    @UserEntity() user: User,
    @Args('data') newUserData: UpdateUserInput,
  ) {
    return this.usersService.updateUser(user.id, newUserData);
  }

  /**
   * 更改用户密码
   * 更改当前认证用户的密码
   * @param user 当前认证用户
   * @param changePassword 包含新密码的输入数据
   * @returns 更新后的用户对象
   */
  @UseGuards(GqlAuthGuard)
  @Mutation(() => User)
  async changePassword(
    @UserEntity() user: User,
    @Args('data') changePassword: ChangePasswordInput,
  ) {
    return this.usersService.changePassword(
      user.id,
      user.password,
      changePassword,
    );
  }

  /**
   * 解析用户的文章字段
   * 获取指定用户的发布文章列表
   * @param author 用户对象
   * @returns 用户的文章列表
   */
  @ResolveField('posts')
  posts(@Parent() author: User) {
    return this.prisma.user.findUnique({ where: { id: author.id } }).posts();
  }
}
