import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { json } from 'body-parser';
import { urlencoded } from 'express';
import helmet from 'helmet';
import { config } from 'dotenv'
import { ConfigService } from '@nestjs/config';
require('dotenv').config() 


async function bootstrap() {
  console.log(process.env.DB_NAME);
  const app = await NestFactory.create(AppModule);
  app.use(
    json({
      limit: '20mb',
    }),
  );
  app.use(
    urlencoded({
      limit: '20mb',
      extended: true,
    }),
  );
  app.enableCors();
  const configService = app.get(ConfigService);
  require('dotenv').config({ path: `../${process.env.NODE_ENV}.env` });


  const options = new DocumentBuilder()
    .setTitle('Food Delivery - BCA ')
    .setDescription('Food Delivery API docs')
    .setVersion('1.0')
    .addTag('foods', '')
    .addTag('delivery', '')
    .addBearerAuth({
      bearerFormat: 'token',
      type: 'http',
      description: 'Token required to update or create transactions',
      scheme: 'bearer',
    })
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('apirest', app, document);


  await app.listen(3000);
}
bootstrap();
