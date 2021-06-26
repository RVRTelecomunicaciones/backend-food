import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt/dist/jwt.module';
import { PassportModule } from '@nestjs/passport/dist/passport.module';
import { ConfigdbModule } from 'src/configdb/configdb.module';
import { ConfigdbService } from 'src/configdb/configdb.service';
import { MailTemplatesModule } from '../mail-templates/mail-templates.module';
import { UsersModule } from '../system/users/users.module';
import { TokensModule } from '../tokens/tokens.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { FacebookStrategy } from './strategy/facebook.strategy';
import { GoogleStrategy } from './strategy/google.strategy';
import { JwtStrategy } from './strategy/jwt.strategy';
import 'dotenv/config';

@Module({
  imports: [
    UsersModule,
    MailTemplatesModule,
    TokensModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigdbModule],
      useFactory: async (configService:ConfigdbService) => {
        return {
          secret: process.env.JWT_SECRET_KEY,
          signOptions: { expiresIn: process.env.JWT_EXPIRES },
        }        
      },
      inject:[ConfigdbService]
    }),
    ConfigdbModule
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [JwtStrategy, PassportModule],
})
export class AuthModule {}
