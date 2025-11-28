import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import type {
  CorsConfig,
  NestConfig,
  SwaggerConfig,
} from './common/configs/config.interface';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Validation
  app.useGlobalPipes(new ValidationPipe());

  // enable shutdown hook
  app.enableShutdownHooks();

  const configService = app.get(ConfigService);
  const nestConfig = configService.get<NestConfig>('nest');
  const corsConfig = configService.get<CorsConfig>('cors');
  const swaggerConfig = configService.get<SwaggerConfig>('swagger');

  // Swagger Api
  if (swaggerConfig.enabled) {
    const options = new DocumentBuilder()
      .setTitle(swaggerConfig.title || 'Nestjs')
      .setDescription(swaggerConfig.description || 'The nestjs API description')
      .setVersion(swaggerConfig.version || '1.0')
      .addTag('健康检查', '应用健康检查相关接口')
      .addBearerAuth(
        {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: '输入 JWT token',
        },
        'JWT-auth',
      )
      .build();
    const document = SwaggerModule.createDocument(app, options);

    SwaggerModule.setup(swaggerConfig.path || 'api', app, document);
  }

  // Cors
  if (corsConfig.enabled) {
    app.enableCors();
  }

  const port = process.env.PORT || nestConfig.port || 3000;
  await app.listen(port);

  // 启动成功日志
  console.log('');
  console.log('🚀 应用启动成功！');
  console.log('');
  console.log(`📍 应用地址: http://localhost:${port}`);
  console.log(`🎮 GraphQL Playground: http://localhost:${port}/graphql`);

  if (swaggerConfig.enabled) {
    console.log(
      `📚 Swagger 文档: http://localhost:${port}/${swaggerConfig.path || 'api'}`,
    );
  }
  console.log('');
}
bootstrap();
