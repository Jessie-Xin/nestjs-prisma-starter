/**
 * Prisma 数据库种子脚本
 * Prisma v7 需要使用数据库适配器
 */

// 加载环境变量并展开变量替换
import * as dotenv from 'dotenv';
import * as dotenvExpand from 'dotenv-expand';
import { PrismaClient } from '../src/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

// 初始化dotenv并展开变量
const myEnv = dotenv.config();
dotenvExpand.expand(myEnv);

// 创建 PostgreSQL 连接池 - 直接使用 DATABASE_URL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // 设置默认 schema (必须通过 options，因为 pg 不识别 URL 中的 schema 参数)
  options: `-c search_path=${process.env.DB_SCHEMA || 'public'}`,
});

// 创建 Prisma PostgreSQL 适配器（指定 schema）
const adapter = new PrismaPg(pool, { schema: process.env.DB_SCHEMA });
// 使用适配器创建 Prisma Client
const prisma = new PrismaClient({ adapter });

async function main() {
  await prisma.user.deleteMany();
  await prisma.post.deleteMany();

  console.log('Seeding...');

  const user1 = await prisma.user.create({
    data: {
      email: 'lisa@simpson.com',
      firstname: 'Lisa',
      lastname: 'Simpson',
      password: '$2b$10$EpRnTzVlqHNP0.fUbXUwSOyuiXe/QLSUG6xNekdHgTGmrpHEfIoxm', // secret42
      role: 'USER',
      posts: {
        create: {
          title: 'Join us for Prisma Day 2019 in Berlin',
          content: 'https://www.prisma.io/day/',
          published: true,
        },
      },
    },
  });
  const user2 = await prisma.user.create({
    data: {
      email: 'bart@simpson.com',
      firstname: 'Bart',
      lastname: 'Simpson',
      role: 'ADMIN',
      password: '$2b$10$EpRnTzVlqHNP0.fUbXUwSOyuiXe/QLSUG6xNekdHgTGmrpHEfIoxm', // secret42
      posts: {
        create: [
          {
            title: 'Subscribe to GraphQL Weekly for community news',
            content: 'https://graphqlweekly.com/',
            published: true,
          },
          {
            title: 'Follow Prisma on Twitter',
            content: 'https://twitter.com/prisma',
            published: false,
          },
        ],
      },
    },
  });

  console.log({ user1, user2 });
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
