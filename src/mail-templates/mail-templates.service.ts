import { Injectable, Logger } from '@nestjs/common';
import { infoTemplate, resetPasswordTemplate, verifyTemplate } from './mail-templates';
import { Mail } from '../mail/mail.interface';
import { MailService } from 'src/mail/mail.service';
import { resetPassword } from './templates/reset-email.html';

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
    /* const mjmlTemplate = infoTemplate;
    const renderedMJML = mustache.render(mjmlTemplate, templateData);
    const html = mjml(renderedMJML).html; */

    const html = resetPassword.replace(new RegExp('--PersonName--', 'g'), nameOrUsername)
    .replace(new RegExp('--ProjectName--', 'g'), "config.project.name")
    .replace(new RegExp('--ProjectAddress--', 'g'), "config.project.address")
    .replace(new RegExp('--ProjectLogo--', 'g'), "config.project.logoUrl")
    .replace(new RegExp('--ProjectSlogan--', 'g'), "config.project.slogan")
    .replace(new RegExp('--ProjectColor--', 'g'), "config.project.color")
    .replace(new RegExp('--ProjectLink--', 'g'), "config.project.url")
    .replace(new RegExp('--Socials--', 'g'), "socials")
    .replace(new RegExp('--ButtonLink--', 'g'), resetPasswordLink);

    const to = email;
    const subject = 'Nueva cuenta creada';
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
 /*    console.log(templateData);
    const mjmlTemplate = resetPasswordTemplate;
    const renderedMJML = mustache.render(mjmlTemplate, templateData);
    const html = mjml(renderedMJML).html; */
    
    console.log("LINK DE RESETAR");
    console.log(resetPasswordLink);
    const html = resetPassword.replace(new RegExp('--PersonName--', 'g'), nameOrUsername)
    .replace(new RegExp('--ProjectName--', 'g'), "Allemant Peritos Valuadores - SGI")
    .replace(new RegExp('--ProjectAddress--', 'g'), "www.allemantperitos.com/appsgi")
    .replace(new RegExp('--ProjectLogo--', 'g'), "http://www.allemantperitos.com/img/logoA.jpg")
    .replace(new RegExp('--ProjectSlogan--', 'g'), "Valor justo, valor exacto.")
    .replace(new RegExp('--ProjectColor--', 'g'), "#1E4473")
    .replace(new RegExp('--ProjectLink--', 'g'), "http://www.allemantperitos.com/appsgi")
    .replace(new RegExp('--Socials--', 'g'), "http://www.allemantperitos.com/img/logoA.jpg")
    .replace(new RegExp('--ButtonLink--', 'g'), resetPasswordLink);
    const subject = 'Se solicitó el restablecimiento de contraseña de tu cuenta de Allemant Peritos';
    const to = email;

    const content = html;
    const mail: Mail = { to, subject, content };
    console.log(mail);

    const sent = await this.mailService.sendMail(mail);
    console.log(sent);

    return sent;
  }
}
