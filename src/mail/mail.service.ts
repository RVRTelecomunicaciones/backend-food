import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { Mail } from 'src/mail/mail.interface';
import 'dotenv/config';
import { Configuration } from 'src/configdb/config.enum';
import { ConfigdbService } from 'src/configdb/configdb.service';
@Injectable()
export class MailService {
  private logger = new Logger('MailService');
  private transporter: nodemailer.Transporter;

  constructor(
    private readonly _config: ConfigdbService
  ) {
    this.transporter = nodemailer.createTransport({
      host: this._config.get(Configuration.EMAIL_HOST),
      port: Number(this._config.get(Configuration.EMAIL_PORT)),
      secure: this._config.get(Configuration.EMAIL_SECURE) === 'true',
      auth: {
        type: 'OAUTH2',
        user: this._config.get(Configuration.EMAIL_USERNAME),
        clientId: this._config.get(Configuration.EMAIL_CLIENT_ID),
        clientSecret: this._config.get(Configuration.EMAIL_CLIENT_SECRET),
        refreshToken: this._config.get(Configuration.EMAIL_REFRESH_TOKEN),
        accessToken: this._config.get(Configuration.EMAIL_ACCESS_TOKEN),
        expires: 1484314697598,
      },
    });

  }

  async sendMail(mail: Mail): Promise<boolean> {
    const { to, subject, content } = mail;
    const from = `"${this._config.get(Configuration.EMAIL_ALIAS)}" <${this._config.get(Configuration.EMAIL_USERNAME)}>`;

    console.log(from);
    const options = {
      from,
      to,
      subject,
      html: content,
    };

    try {
      await this.transporter.sendMail(options);
    } catch (error) {
      this.logger.error(`Failed send mail ${error}`);
      return false;
    }
    return true;
  }
}
