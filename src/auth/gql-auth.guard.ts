import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GqlExecutionContext } from '@nestjs/graphql';

/**
 * GraphQL 认证守卫
 * 继承自 Passport 的 JWT 认证守卫，用于 GraphQL 请求的认证
 */
@Injectable()
export class GqlAuthGuard extends AuthGuard('jwt') {
  /**
   * 获取请求对象
   * 从 GraphQL 执行上下文中获取请求对象
   * @param context 执行上下文
   * @returns 请求对象
   */
  getRequest(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context);
    return ctx.getContext().req;
  }
}
