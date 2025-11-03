import { Module } from '@nestjs/common';
import { PostsResolver } from './posts.resolver';

/**
 * 文章模块
 * 定义文章功能的相关组件和依赖
 */
@Module({
  // 模块导入（当前为空）
  imports: [],
  // 模块提供的服务
  providers: [PostsResolver],
})
export class PostsModule {}
