import type { Config } from './config.interface';

const config: Config = {
  nest: {
    port: 3000,
  },
  cors: {
    enabled: true,
  },
  swagger: {
    enabled: true,
    title: 'NestJS Prisma Starter API',
    description:
      'NestJS Prisma Starter 的 REST API 文档。\n\n' +
      '注意：本项目主要使用 GraphQL API，请访问 /graphql 使用 GraphQL Playground。\n' +
      '此处的 REST API 仅用于健康检查和基本操作。',
    version: '1.5',
    path: 'api',
  },
  graphql: {
    playgroundEnabled: true,
    debug: true,
    schemaDestination: './src/schema.graphql',
    sortSchema: true,
  },
  security: {
    expiresIn: 120, // 2 minutes in seconds
    refreshIn: 604800, // 7 days in seconds (7 * 24 * 60 * 60)
    bcryptSaltOrRound: 10,
  },
};

export default (): Config => config;
