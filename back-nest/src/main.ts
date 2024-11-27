import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

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
  console.log(`Server is running on http://localhost:${PORT}`);
}

bootstrap();
