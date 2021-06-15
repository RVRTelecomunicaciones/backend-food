import { Module } from '@nestjs/common';
import { MailModule } from 'src/mail/mail.module';
import { MailTemplatesService } from './mail-templates.service';

@Module({
  imports: [MailModule],
  providers: [MailTemplatesService],
  exports: [MailTemplatesService],
})
export class MailTemplatesModule {}
