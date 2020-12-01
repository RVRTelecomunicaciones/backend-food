import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();

  const options = new DocumentBuilder()
    .setTitle('Food Delivery - BCA')
    .setDescription('Food Delivery API docs')
    .setVersion('1.0')
    .addTag('foods', '')
    .addTag('delivery', '')
    .setLicense(
      'Apache License, Version 2.0',
      'https://www.apache.org/licenses/LICENSE-2.0',
    )
    .setContact('RUSSELL V.', 'https://jonah.pw', 'russellvergara@hotmail.com')
    .addBearerAuth({
      bearerFormat: 'token',
      type: 'http',
      description: 'Token required to update or create transactions',
      scheme: 'bearer',
    })
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
}
bootstrap();
