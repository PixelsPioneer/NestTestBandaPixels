import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule, { bufferLogs: true });

  app.enableCors({
    origin: process.env.CORS_ORIGIN,
  });

  const config = new DocumentBuilder()
    .setTitle('Scraper API')
    .setDescription('API documentation for scraping service')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);

  const PORT = process.env.PORT;
  await app.listen(PORT);
  logger.log(`Server is running on http://localhost:${PORT}`);
}

bootstrap();
