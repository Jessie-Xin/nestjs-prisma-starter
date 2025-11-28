/**
 * Prisma Module
 *
 * 此模块提供 PrismaService 给整个应用使用
 */

import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
