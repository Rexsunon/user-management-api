import { ValidationPipe } from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './core/filters/http-exception.filter';
import {
  IgnoreJwtAuthInterceptor,
  HttpLogInterceptor,
} from './core/interceptors';
import { seed } from './core/seed';
import { CustomLogger } from './core/config';

async function bootstrap() {
  // Run the seed
  await seed();

  const app = await NestFactory.create(AppModule, { bufferLogs: true });

  const logger = new CustomLogger();
  app.useLogger(logger);

  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(
    new HttpLogInterceptor(logger),
    new IgnoreJwtAuthInterceptor(app.get(Reflector)),
  );
  app.useGlobalPipes(
    new ValidationPipe({ transform: true, skipNullProperties: true }),
  );
  app.setGlobalPrefix('user-manager');

  const config = new DocumentBuilder()
    .setTitle('User management API')
    .setDescription('User management API description')
    .addBearerAuth()
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('user-manager/docs', app, document);

  await app.listen(process.env.PORT || 3000);
}
bootstrap();
