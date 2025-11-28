/**
 * Prisma CLI 配置文件 (Prisma v7+)
 *
 * 此文件为 Prisma CLI 提供配置,包括:
 * - Schema 文件位置
 * - 迁移文件路径
 * - 种子脚本
 * - 数据源 URL
 */

// 加载环境变量 - 必须在最顶部
import 'dotenv/config';
import { defineConfig, env } from 'prisma/config';

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
    // Prisma v7 中,seed 命令在这里配置,不再使用 package.json 中的 prisma.seed
    seed: 'ts-node prisma/seed.ts',
  },
  datasource: {
    // Prisma v7 要求在配置文件中指定数据源 URL
    // 从环境变量中读取 DATABASE_URL
    url: env('DATABASE_URL'),
    // 如果有 shadow database,可以在这里配置:
    // shadowDatabaseUrl: env('SHADOW_DATABASE_URL'),
  },
});
