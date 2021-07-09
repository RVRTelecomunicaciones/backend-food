import { Injectable, Logger } from '@nestjs/common';
import { infoTemplate, resetPasswordTemplate, verifyTemplate } from './mail-templates';
import { Mail } from '../mail/mail.interface';
import { MailService } from 'src/mail/mail.service';

const mustache = require('mustache');
const mjml = require('mjml');

@Injectable()
export class MailTemplatesService {
  constructor(private mailService: MailService) {}

  async sendMailVerify(email: string, nameOrUsername: string, activationLink: string, deleteLink: string) {
    const templateData = {
      nameOrUsername,
      activationLink,
      deleteLink,
    };
    const mjmlTemplate = verifyTemplate;
    const renderedMJML = mustache.render(mjmlTemplate, templateData);
    const html = mjml(renderedMJML).html;
    const subject = 'Activación de cuenta';
    const to = email;
    const content = html;
    const mail: Mail = { to, subject, content };
    const sent = await this.mailService.sendMail(mail);
    return sent;
  }

  async sendMailInfo(email: string, nameOrUsername: string, deleteLink: string, resetPasswordLink: string) {
    const templateData = {
      nameOrUsername,
      deleteLink,
      resetPasswordLink,
    };
    const mjmlTemplate = infoTemplate;
    const renderedMJML = mustache.render(mjmlTemplate, templateData);
    const html = mjml(renderedMJML).html;
    const subject = 'Nueva cuenta creada';
    const to = email;
    const content = html;
    const mail: Mail = { to, subject, content };
    const sent = await this.mailService.sendMail(mail);
    return sent;
  }

  async sendMailResetPassword(email: string, nameOrUsername: string, resetPasswordLink: string) {
    const templateData = {
      nameOrUsername,
      resetPasswordLink,
    };
    console.log(templateData);
    const mjmlTemplate = resetPasswordTemplate;
    const renderedMJML = mustache.render(mjmlTemplate, templateData);
    const html = mjml(renderedMJML).html;
    const subject = 'Cambiá tu contraseña';
    const to = email;
    console.log(to);

    const content = html;
    const mail: Mail = { to, subject, content };
    console.log(mail);

    const sent = await this.mailService.sendMail(mail);
    console.log(sent);

    return sent;
  }
}
