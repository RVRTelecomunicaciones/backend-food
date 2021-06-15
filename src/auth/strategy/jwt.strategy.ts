import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtPayloadBase, JwtPayload } from './jwt-payload.interface';
import { User } from 'src/system/users/users.entity';
import { UsersService } from 'src/system/users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(public usersService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET_KEY,
    });
  }

  async validate(payload: JwtPayload): Promise<User> {
    const { username, iat } = payload;
    const user = await this.usersService.getUserByUsername(username);
    const iatDate = new Date(iat * 1000);
    if (!user) {
      throw new UnauthorizedException('Se le informa que el token no es válido');
    }
    if (user.passwordChangedAt && iatDate < user.passwordChangedAt) {
      throw new UnauthorizedException('Se l informa que se ha modificado su contraseña, por favor ingrese nuevamente');
    }
    return user;
  }
}