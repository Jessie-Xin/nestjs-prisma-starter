/**
 * Prisma Service - NestJS 官方推荐实现
 *
 * 此服务继承自 PrismaClient，并在构造函数中初始化数据库适配器
 * 适配器是 Prisma v7 的新要求
 */

import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor() {
    // 创建 PostgreSQL 连接池 - 直接使用 DATABASE_URL
    const pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      // 设置默认 schema (必须通过 options，因为 pg 不识别 URL 中的 schema 参数)
      options: `-c search_path=${process.env.DB_SCHEMA || 'public'}`,
    });

    // 创建 Prisma PostgreSQL 适配器
    const adapter = new PrismaPg(pool, { schema: process.env.DB_SCHEMA });

    // 使用适配器初始化 PrismaClient
    super({ adapter });
  }

  /**
   * NestJS 生命周期钩子
   * 在模块初始化时连接到数据库
   */
  async onModuleInit() {
    await this.$connect();
  }
}
