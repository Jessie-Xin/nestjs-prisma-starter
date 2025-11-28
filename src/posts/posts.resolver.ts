import { PrismaService } from '../prisma/prisma.service';
import {
  Resolver,
  Query,
  Parent,
  Args,
  ResolveField,
  Subscription,
  Mutation,
} from '@nestjs/graphql';
import { findManyCursorConnection } from '@devoxa/prisma-relay-cursor-connection';
import { PubSub } from 'graphql-subscriptions';
import { UseGuards } from '@nestjs/common';
import { PaginationArgs } from '../common/pagination/pagination.args';
import { UserEntity } from '../common/decorators/user.decorator';
import { User } from '../users/models/user.model';
import { GqlAuthGuard } from '../auth/gql-auth.guard';
import { PostIdArgs } from './args/post-id.args';
import { UserIdArgs } from './args/user-id.args';
import { Post } from './models/post.model';
import { PostConnection } from './models/post-connection.model';
import { PostOrder } from './dto/post-order.input';
import { CreatePostInput } from './dto/createPost.input';

// GraphQL 订阅发布器，用于发布文章创建事件
const pubSub = new PubSub();

/**
 * 文章解析器
 * 处理文章相关的 GraphQL 请求和订阅
 */
@Resolver(() => Post)
export class PostsResolver {
  constructor(private prisma: PrismaService) {}

  /**
   * 文章创建订阅
   * 当有新文章创建时触发
   * @returns 异步可迭代的发布流
   */
  @Subscription(() => Post)
  postCreated() {
    return pubSub.asyncIterableIterator('postCreated');
  }

  /**
   * 创建文章
   * 需要用户认证，创建后发布新文章事件
   * @param user 当前认证用户
   * @param data 创建文章的输入数据
   * @returns 创建的文章对象
   */
  @UseGuards(GqlAuthGuard)
  @Mutation(() => Post)
  async createPost(
    @UserEntity() user: User,
    @Args('data') data: CreatePostInput,
  ) {
    const newPost = this.prisma.post.create({
      data: {
        published: true, // 新创建的文章默认为已发布状态
        title: data.title, // 文章标题
        content: data.content, // 文章内容
        authorId: user.id, // 文章作者ID
      },
    });
    // 发布文章创建事件
    pubSub.publish('postCreated', { postCreated: newPost });
    return newPost;
  }

  /**
   * 查询已发布文章
   * 支持分页、搜索和排序功能
   * @param after 分页参数 - 在指定游标之后的记录
   * @param before 分页参数 - 在指定游标之前的记录
   * @param first 分页参数 - 获取的记录数量（向前）
   * @param last 分页参数 - 获取的记录数量（向后）
   * @param query 搜索关键词（可选）
   * @param orderBy 排序选项（可选）
   * @returns 分页后的文章连接
   */
  @Query(() => PostConnection)
  async publishedPosts(
    @Args() { after, before, first, last }: PaginationArgs,
    @Args({ name: 'query', type: () => String, nullable: true })
    query: string,
    @Args({
      name: 'orderBy',
      type: () => PostOrder,
      nullable: true,
    })
    orderBy: PostOrder,
  ) {
    const a = await findManyCursorConnection(
      (args) =>
        this.prisma.post.findMany({
          include: { author: true }, // 包含作者信息
          where: {
            published: true, // 只查询已发布文章
            title: { contains: query || '' }, // 根据标题搜索
          },
          orderBy: orderBy ? { [orderBy.field]: orderBy.direction } : undefined, // 应用排序
          ...args,
        }),
      () =>
        this.prisma.post.count({
          where: {
            published: true, // 只计算已发布文章数量
            title: { contains: query || '' }, // 根据标题搜索
          },
        }),
      { first, last, before, after }, // 分页参数
    );
    return a;
  }

  /**
   * 查询用户文章
   * 获取指定用户发布的所有文章
   * @param id 用户ID参数
   * @returns 用户发布的文章列表
   */
  @Query(() => [Post])
  userPosts(@Args() id: UserIdArgs) {
    return this.prisma.user
      .findUnique({ where: { id: id.userId } })
      .posts({ where: { published: true } }); // 只返回已发布的文章

    // 或者使用以下方法：
    // return this.prisma.posts.findMany({
    //   where: {
    //     published: true,
    //     author: { id: id.userId }
    //   }
    // });
  }

  /**
   * 查询单篇文章
   * 根据ID获取指定文章
   * @param id 文章ID参数
   * @returns 指定ID的文章对象
   */
  @Query(() => Post)
  async post(@Args() id: PostIdArgs) {
    return this.prisma.post.findUnique({ where: { id: id.postId } });
  }

  /**
   * 解析文章的作者字段
   * 从文章对象中获取作者信息
   * @param post 文章对象
   * @returns 文章的作者对象
   */
  @ResolveField('author', () => User)
  async author(@Parent() post: Post) {
    return this.prisma.post.findUnique({ where: { id: post.id } }).author();
  }
}
