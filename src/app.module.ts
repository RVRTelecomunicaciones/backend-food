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
import * as dotenv from 'dotenv';
require('dotenv').config() 
const ENV = process.env.NODE_ENV;

@Module({
  imports: [ConfigModule.forRoot(
    {
      isGlobal: true,
      envFilePath: !ENV ? '.env' : `${ENV}.env`,
      
  }),DatabaseModule, ConfigdbModule, SystemModule, AuthModule, MailTemplatesModule, TokensModule, MailModule],
  //imports: [DatabaseModule, ConfigdbModule, SystemModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
