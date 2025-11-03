import 'reflect-metadata';
import {
  ObjectType,
  registerEnumType,
  HideField,
  Field,
} from '@nestjs/graphql';
import { IsEmail } from 'class-validator';
import { Post } from '../../posts/models/post.model';
import { BaseModel } from '../../common/models/base.model';
import { Role } from '@prisma/client';

// 注册 Role 枚举类型到 GraphQL 模式
registerEnumType(Role, {
  name: 'Role', // 枚举名称
  description: 'User role', // 枚举描述
});

/**
 * 用户模型
 * 继承自基础模型，包含用户的基本信息、角色和关联的文章
 */
@ObjectType()
export class User extends BaseModel {
  /**
   * 用户邮箱
   * 需要是一个有效的邮箱地址
   */
  @Field()
  @IsEmail()
  email: string;

  /**
   * 用户名
   * 可选字段，包含用户名字
   */
  @Field(() => String, { nullable: true })
  firstname?: string;

  /**
   * 用户姓
   * 可选字段，包含用户姓氏
   */
  @Field(() => String, { nullable: true })
  lastname?: string;

  /**
   * 用户角色
   * 定义用户在系统中的权限角色
   */
  @Field(() => Role)
  role: Role;

  /**
   * 用户文章
   * 与该用户关联的文章列表，可能为空
   */
  @Field(() => [Post], { nullable: true })
  posts?: [Post] | null;

  /**
   * 用户密码
   * 在 GraphQL 响应中隐藏该字段
   */
  @HideField()
  password: string;
}
