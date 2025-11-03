import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from 'nestjs-prisma';
import { ConfigService } from '@nestjs/config';
import { PasswordService } from './password.service';

/**
 * PasswordService 的单元测试
 */
describe('PasswordService', () => {
  let service: PasswordService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      // 配置测试模块，提供 PasswordService 及其依赖项
      providers: [PasswordService, PrismaService, ConfigService],
    }).compile();

    service = module.get<PasswordService>(PasswordService);
  });

  // 测试服务是否已定义
  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
