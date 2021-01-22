import { Module } from '@nestjs/common';
import { ConfigdbService } from './configdb.service';

@Module({
  providers: [
    {
      provide: ConfigdbService,
      useValue: new ConfigdbService(),
    },
  ],
  exports: [ConfigdbService],
})
export class ConfigdbModule {}
