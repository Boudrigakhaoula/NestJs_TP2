import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Appliquer le ValidationPipe globalement
  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));

  // Appliquer le filtre d'exceptions globalement
  app.useGlobalFilters(new HttpExceptionFilter());

  await app.listen(3000);
}
bootstrap();