import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ConfigdbService } from 'src/configdb/configdb.service';
import { TokensService } from './tokens.service';

@Module({
  imports:[ConfigModule],
  providers: [TokensService,ConfigdbService],
  exports: [TokensService],
})
export class TokensModule {}