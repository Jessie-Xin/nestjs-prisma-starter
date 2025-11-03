import { Module } from '@nestjs/common';
import { UsersResolver } from './users.resolver';
import { UsersService } from './users.service';
import { PasswordService } from '../auth/password.service';

/**
 * 用户模块
 * 定义用户功能的相关组件和依赖
 */
@Module({
  // 模块导入（当前为空）
  imports: [],
  // 模块提供的服务
  providers: [
    // 用户解析器
    UsersResolver,
    // 用户服务
    UsersService,
    // 密码服务（从认证模块导入）
    PasswordService,
  ],
})
export class UsersModule {}
