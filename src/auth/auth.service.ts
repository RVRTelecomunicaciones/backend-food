import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import * as bcrypt from 'bcrypt';
import { JwtPayloadBase } from './strategy/jwt-payload.interface';
import { NewPasswordDto } from './dto/new-password.dto';
import { Logger } from '@nestjs/common';
import { EmailDto } from './dto/resend-verification.dto';

import { TokenDto } from './dto/tokens.dto';
import { generate } from 'generate-password';
import { TokensService } from '../tokens/tokens.service';
import { TokenType } from '../tokens/tokens-type.enum';
import { MailTemplatesService } from '../mail-templates/mail-templates.service';
import { CreateUserDto } from '../system/users/dto/create-user.dto';

import { UserStatus } from '../system/users/user-status.enum';
import { TokenPayload, TokenPayloadBase } from '../tokens/dto/token-payload.dto';
import { UsersService } from '../system/users/users.service';
import { config } from 'dotenv';
import 'dotenv/config';
import { SimpleConsoleLogger } from 'typeorm';

@Injectable()
export class AuthService {
  private logger = new Logger('AuthService');
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly mailTemplatesService: MailTemplatesService,
    private readonly tokensService: TokensService,
  ) { }

  async signUp(createUserDto: CreateUserDto): Promise<{ accessToken: string }> {
    const { username, password, email } = createUserDto;
    const salt = await bcrypt.genSalt();
    createUserDto.password = await bcrypt.hash(createUserDto.password, salt);
    const userId = await this.usersService.createUser(createUserDto);
    if (!userId) {
      throw new InternalServerErrorException(
        'Healthy Dev no pudo registrar su usuario en este momento, intentelo nuevamente más tarde',
      );
    }
    try {
      this.sendEmailVerification(username, email);
    } catch (error) {
      this.logger.error(`Error sending verification email in sign up: ${error}`);
    }
    const authCredentialsDto: AuthCredentialsDto = { usernameOrEmail: username, password };
    return this.signIn(authCredentialsDto);
  }

  async resendVerificationAccount(emailDto: EmailDto): Promise<{ message: string }> {
    const { email } = emailDto;
    const user = await this.usersService.getUserByEmail(email);
    if (!user) {
      throw new NotFoundException('Healthy Dev no encontró un usuario registrado con ese email');
    }
    if (user.status !== UserStatus.INACTIVO) {
      throw new ConflictException('Healthy Dev le informa que la cuenta ya esta activa');
    }
    const nameOrUsername = user.name ? user.name : user.username;
    const sent = await this.sendEmailVerification(nameOrUsername, email);
    if (!sent) {
      throw new InternalServerErrorException(
        'Healthy Dev le informa que no se ha podido enviar email. Inténtelo nuevamente más tarde',
      );
    }
    return {
      message: 'Healthy Dev le informa que se ha reenviado el email de verificación correctamente',
    };
  }

  async forgotPassword(emailDto: EmailDto): Promise<{ message: string }> {
    const { email } = emailDto;
    const user = await this.usersService.getUserByEmail(email);
    console.log("LLEGO");
    console.log(user.email);
    if (!user) {
      throw new NotFoundException('Healthy Dev no encontró un usuario registrado con ese email');
    }
    const nameOrUsername = user.name ? user.name : user.username;
    console.log(nameOrUsername);

    const sent = await this.sendEmailForgotPassword(nameOrUsername, email);
    console.log(sent);

    if (!sent) {
      throw new InternalServerErrorException(
        'Healthy Dev le informa que no se ha podido enviar email. Inténtelo nuevamente más tarde',
      );
    }
    return {
      message: 'Healthy Dev le informa que se ha enviado el email para crear nueva contraseña correctamente',
    };
  }

  async verifyAccount(tokenDto: TokenDto): Promise<{ message: string }> {
    let tokenPayload: TokenPayload;
    try {
      tokenPayload = await this.tokensService.verifyEncryptedToken(tokenDto.token);
    } catch (error) {
      throw new UnauthorizedException(
        'Healthy Dev le informa que no ha podido verificar cuenta, por favor solicite nuevamente envio de verificación',
      );
    }
    if (tokenPayload.type !== TokenType.VERIFY_EMAIL) {
      throw new UnauthorizedException(
        'Healthy Dev le informa que no ha podido verificar cuenta, por favor solicite nuevamente envio de verificación',
      );
    }
    const user = await this.usersService.getUserByEmail(tokenPayload.email);
    if (!user) {
      throw new NotFoundException('Healthy Dev no encontró un usuario registrado con ese email');
    }
    if (user.status !== UserStatus.INACTIVO) {
      throw new ConflictException('Healthy Dev le informa que la cuenta ya esta activa');
    }
    user.status = UserStatus.ACTIVO;
    await user.save();
    return { message: 'Healthy Dev le informa que el usuario fue activado correctamente.' };
  }

  async sendEmailVerification(nameOrUsername: string, email: string): Promise<boolean> {
    const tokenPayloadBaseActivation: TokenPayloadBase = { type: TokenType.VERIFY_EMAIL, email };
    console.log(tokenPayloadBaseActivation);
    console.log("Llego token");
    const activationToken = await this.tokensService.getEncryptedToken(tokenPayloadBaseActivation);
    const activationLink = `${process.env.CLIENT_URL_VERIFICATION}?token=${activationToken}`;
    const tokenPayloadBaseDelete: TokenPayloadBase = { type: TokenType.DELETE_USER, email };
    const deleteToken = await this.tokensService.getEncryptedToken(tokenPayloadBaseDelete);
    const deleteLink = `${process.env.CLIENT_URL_DELETE_USER}?token=${deleteToken}`;
    let sent;
    try {
      sent = await this.mailTemplatesService.sendMailVerify(email, nameOrUsername, activationLink, deleteLink);
    } catch (error) {
      this.logger.error(`Failed send mail ${error}`);
      return false;
    }
    return sent;
  }

  async sendEmailForgotPassword(nameOrUsername: string, email: string): Promise<boolean> {

    console.log("Email forgot");
    const tokenPayloadBase: TokenPayloadBase = { type: TokenType.RESET_PASSWORD, email };
    console.log(tokenPayloadBase);
    const resetPasswordToken = await this.tokensService.getEncryptedToken(tokenPayloadBase);
    console.log(resetPasswordToken);
    const resetPasswordLink = `${process.env.CLIENT_URL_RESET_PASSWORD}?token=${resetPasswordToken}`;
    console.log(resetPasswordLink);
    let sent;
    try {
      sent = await this.mailTemplatesService.sendMailResetPassword(email, nameOrUsername, resetPasswordLink);
      console.log(sent);

    } catch (error) {
      this.logger.error(`Failed send mail ${error}`);
      return false;
    }
    return sent;
  }

  async sendSignUpInfoEmail(nameOrUsername: string, email: string): Promise<boolean> {
    const tokenPayloadBase: TokenPayloadBase = { type: TokenType.DELETE_USER, email };
    const deleteToken = await this.tokensService.getEncryptedToken(tokenPayloadBase);
    const deleteLink = `${process.env.CLIENT_URL_DELETE_USER}?token=${deleteToken}`;
    const tokenPlBase: TokenPayloadBase = { type: TokenType.RESET_PASSWORD, email };
    const resetPassToken = await this.tokensService.getEncryptedToken(tokenPlBase);
    const resetPasswordLink = `${process.env.CLIENT_URL_RESET_PASSWORD}?token=${resetPassToken}`;
    let sent;
    try {
      sent = await this.mailTemplatesService.sendMailInfo(email, nameOrUsername, deleteLink, resetPasswordLink);
    } catch (error) {
      this.logger.error(`Failed send mail ${error}`);
      return false;
    }
    return sent;
  }

  async signIn(authCredentialsDto: AuthCredentialsDto): Promise<{ accessToken: string }> {
    const username = await this.validateUserPassword(authCredentialsDto);
    console.log(username);

    if (!username) {
      throw new UnauthorizedException('Verifique los datos ingresados');
    }
    const payload: JwtPayloadBase = { username };
    const accessToken = await this.jwtService.sign(payload);
    return { accessToken };
  }

  async validateUserPassword(authCredentialsDto: AuthCredentialsDto): Promise<string> {
    const { usernameOrEmail, password } = authCredentialsDto;
    const user = await this.usersService.getUserByUsernameOrEmail(usernameOrEmail);
    console.log(user);
    if (user && (await bcrypt.compare(password, user.password))) {
      return user.username;
    }
    return null;
  }

  async resetPassword(newPassword: NewPasswordDto, tokenDto: TokenDto): Promise<{ message: string }> {
    let tokenPayload: TokenPayload;
    try {
      tokenPayload = await this.tokensService.verifyEncryptedToken(tokenDto.token);
    } catch (error) {
      throw new UnauthorizedException(
        'Healthy Dev le informa que no ha podido cambiar la contraseña, por favor solicite nuevamente envio para realizar nueva contraseña',
      );
    }
    if (tokenPayload.type !== TokenType.RESET_PASSWORD) {
      throw new UnauthorizedException(
        'Healthy Dev le informa que no ha podido cambiar la contraseña, por favor solicite nuevamente envio para realizar nueva contraseña',
      );
    }
    const user = await this.usersService.getUserByEmail(tokenPayload.email);
    if (!user) {
      throw new NotFoundException('Healthy Dev no encontró un usuario registrado con ese email');
    }
    const salt = await bcrypt.genSalt();
    newPassword.password = await bcrypt.hash(newPassword.password, salt);
    return this.usersService.changePassword(newPassword, user.username);
  }

  async changePassword(newPassword: NewPasswordDto, username: string): Promise<{ message: string }> {
    const salt = await bcrypt.genSalt();
    newPassword.password = await bcrypt.hash(newPassword.password, salt);
    return this.usersService.changePassword(newPassword, username);
  }

  async socialLoginAuth(user: any, res: any): Promise<void> {
    let accessToken: string;
    const findUserByEmail = await this.usersService.getUserByEmail(user.email);
    if (!findUserByEmail) {
      let username: string = user.email.split('@')[0];
      const password: string = generate({ length: 20, numbers: true });
      while (await this.usersService.getUserByUsername(username)) {
        username += generate({ length: 2 });
      }
      const createUserDto: CreateUserDto = {
        email: user.email,
        username,
        password,
      };
      accessToken = await this.signUpSocialLogin(createUserDto);
    } else {
      const { username } = findUserByEmail;
      const payload: JwtPayloadBase = { username };
      accessToken = await this.jwtService.sign(payload);
    }
    res.redirect(`${process.env.SOCIAL_AUTH_CLIENT_URL}?token=${accessToken}`);
  }

  async signUpSocialLogin(createUserDto: CreateUserDto): Promise<string> {
    const { username, password, email } = createUserDto;
    const salt = await bcrypt.genSalt();
    createUserDto.password = await bcrypt.hash(createUserDto.password, salt);
    const userId = await this.usersService.createUser(createUserDto, true);
    if (!userId) {
      throw new InternalServerErrorException(
        'Healthy Dev no pudo registrar su usuario en este momento, intentelo nuevamente más tarde',
      );
    }
    try {
      this.sendSignUpInfoEmail(username, email);
    } catch (error) {
      this.logger.error(`Error sending verification email in sign up: ${error}`);
    }
    const authCredentialsDto: AuthCredentialsDto = { usernameOrEmail: username, password };
    const { accessToken } = await this.signIn(authCredentialsDto);
    return accessToken;
  }
}
