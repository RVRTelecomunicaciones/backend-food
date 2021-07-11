import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ConfigdbService } from 'src/configdb/configdb.service';
import { MailService } from './mail.service';

@Module({
  imports:[ConfigModule],
  providers: [MailService,ConfigdbService],
  exports: [MailService],
})
export class MailModule {}
