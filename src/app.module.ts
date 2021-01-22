import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { ConfigdbModule } from './configdb/configdb.module';
import { SystemModule } from './system/system.module';

@Module({
  imports: [DatabaseModule, ConfigdbModule, SystemModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
