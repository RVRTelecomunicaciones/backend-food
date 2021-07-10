import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { ConfigdbModule } from './configdb/configdb.module';
import { SystemModule } from './system/system.module';
import { AuthModule } from './auth/auth.module';
import { MailTemplatesModule } from './mail-templates/mail-templates.module';
import { TokensModule } from './tokens/tokens.module';
import { MailModule } from './mail/mail.module';
import { ConfigModule } from '@nestjs/config';
import * as Joi from '@hapi/joi';
import { join } from 'path';
import { config } from 'dotenv'
require('dotenv').config() 


@Module({
  imports: [ConfigModule.forRoot({
    validationSchema: Joi.object({
      DB_HOST: Joi.string().required(),
      DB_PORT: Joi.number().required(),
      DB_NAME: Joi.string().required(),
      DB_USERNAME: Joi.string().required(),
      DB_PASSWORD: Joi.string().required(),
      //CLOUDINARY_USER: Joi.string().required(),
      //CLOUDINARY_API_KEY: Joi.string().required(),
      //CLOUDINARY_API_SECRET: Joi.string().required(),
      JWT_SECRET_KEY: Joi.string().required(),
      JWT_EXPIRES: Joi.string().required(),
      FACEBOOK_CLIENT_SECRET: Joi.string().required(),
      FACEBOOK_CLIENT_ID: Joi.string().required(),
      FACEBOOK_BACKEND_URL: Joi.string().required(),
      GOOGLE_CLIENT_SECRET: Joi.string().required(),
      GOOGLE_CLIENT_ID: Joi.string().required(),
      GOOGLE_BACKEND_URL: Joi.string().required(),
      SOCIAL_AUTH_CLIENT_URL: Joi.string().required(),
      EMAIL_AUTH_TYPE: Joi.string().required(),
      EMAIL_SERVICE: Joi.string().required(),
      EMAIL_HOST: Joi.string().required(),
      EMAIL_PORT: Joi.string().required(),
      EMAIL_SECURE: Joi.string().required(),
      EMAIL_ALIAS: Joi.string().required(),
      EMAIL_USERNAME: Joi.string().required(),
      EMAIL_CLIENT_ID: Joi.string().required(),
      EMAIL_CLIENT_SECRET: Joi.string().required(),
      EMAIL_REFRESH_TOKEN: Joi.string().required(),
      EMAIL_ACCESS_TOKEN: Joi.string().required(),
      EMAIL_TOKEN_EXPIRES: Joi.string().required(),

      //CLIENT_URL_VERIFICATION: Joi.string().required(),
      //CLIENT_URL_RESET_PASSWORD: Joi.string().required(),
      //CLIENT_URL_DELETE_USER: Joi.string().required(),


      TOKENS_BIT_LENGTH: Joi.string().required(),
      TOKENS_ALGORITHM: Joi.string().required(),
      TOKENS_EXPIRES: Joi.string().required(),
      
    })
  }),DatabaseModule, ConfigdbModule, SystemModule, AuthModule, MailTemplatesModule, TokensModule, MailModule],
  //imports: [DatabaseModule, ConfigdbModule, SystemModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
