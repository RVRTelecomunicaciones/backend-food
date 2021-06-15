import { Injectable } from '@nestjs/common';
import { parse } from 'dotenv';
import { existsSync, readFileSync } from 'fs';

@Injectable()
export class ConfigdbService {
  private readonly envConfig: { [key: string]: string };

  constructor() {
    const isDevEnv: boolean = process.env.NODE_ENV !== 'production';

    if (isDevEnv) {
      const envFilePath: string = __dirname + '/../../.env';
      const existPath: boolean = existsSync(envFilePath);

      if (!existPath) {
        console.log('.env does not exist');
        process.exit(0);
      }

      this.envConfig = parse(readFileSync(envFilePath));
    } else {
      this.envConfig = {
        PORT: process.env.PORT,
        DB_HOST: process.env.DB_HOST,
        DB_PORT: process.env.DB_PORT,
        DB_NAME: process.env.DB_NAME,
        DB_USERNAME: process.env.DB_USERNAME,
        DB_PASSWORD: process.env.DB_PASSWORD,
        JWT_SECRET: process.env.JWT_SECRET,

        //SEND EMAIL USE OAUTH2
        EMAIL_AUTH_TYPE: process.env.EMAIL_AUTH_TYPE,
        EMAIL_SERVICE: process.env.EMAIL_SERVICE,
        EMAIL_HOST: process.env.EMAIL_HOST,
        EMAIL_PORT: process.env.EMAIL_PORT,
        EMAIL_SECURE: process.env.EMAIL_SECURE,
        EMAIL_ALIAS: process.env.EMAIL_ALIAS,
        EMAIL_USERNAME: process.env.EMAIL_USERNAME,
        EMAIL_CLIENT_ID: process.env.EMAIL_CLIENT_ID,
        EMAIL_CLIENT_SECRET: process.env.EMAIL_CLIENT_SECRET,
        EMAIL_REFRESH_TOKEN: process.env.EMAIL_REFRESH_TOKEN,
        EMAIL_ACCESS_TOKEN: process.env.EMAIL_ACCESS_TOKEN,
        EMAIL_TOKEN_EXPIRES: process.env.EMAIL_TOKEN_EXPIRES,
      };
    }
  }

  get(key: string): string {
    return this.envConfig[key];
  }
}
