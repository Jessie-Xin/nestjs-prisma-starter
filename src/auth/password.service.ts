import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { hash, compare } from 'bcrypt';
import { SecurityConfig } from '../common/configs/config.interface';

/**
 * 密码服务类
 * 提供密码哈希和验证功能
 */
@Injectable()
export class PasswordService {
  /**
   * 获取 bcrypt 盐轮数
   * 从配置中获取盐值或轮数，如果配置的是数字则转换为数字类型
   */
  get bcryptSaltRounds(): string | number {
    const securityConfig = this.configService.get<SecurityConfig>('security');
    const saltOrRounds = securityConfig.bcryptSaltOrRound;

    return Number.isInteger(Number(saltOrRounds))
      ? Number(saltOrRounds)
      : saltOrRounds;
  }

  constructor(private configService: ConfigService) {}

  /**
   * 验证密码
   * @param password 明文密码
   * @param hashedPassword 哈希后的密码
   * @returns 密码匹配返回 true，否则返回 false
   */
  validatePassword(password: string, hashedPassword: string): Promise<boolean> {
    return compare(password, hashedPassword);
  }

  /**
   * 哈希密码
   * @param password 明文密码
   * @returns 哈希后的密码
   */
  hashPassword(password: string): Promise<string> {
    return hash(password, this.bcryptSaltRounds);
  }
}
