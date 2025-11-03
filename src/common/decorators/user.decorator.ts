import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

/**
 * 用户实体装饰器
 * 用于从 GraphQL 请求上下文中提取当前认证用户信息
 * 在 GraphQL 解析器中使用，获取当前登录的用户对象
 */
export const UserEntity = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) =>
    GqlExecutionContext.create(ctx).getContext().req.user,
);
