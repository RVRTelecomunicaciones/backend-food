import { TypeOrmModule } from '@nestjs/typeorm/dist/typeorm.module';
import { Configuration } from 'src/configdb/config.enum';
import { ConfigdbModule } from 'src/configdb/configdb.module';
import { ConfigdbService } from 'src/configdb/configdb.service';
import { ConnectionOptions } from 'typeorm/connection/ConnectionOptions';

export const databaseProvider = [
  TypeOrmModule.forRootAsync({
    imports: [ConfigdbModule],
    inject: [ConfigdbService],
    useFactory: (_config: ConfigdbService) => ({
      type: 'postgres' as 'postgres',
      host: _config.get(Configuration.DB_HOST),
      database: _config.get(Configuration.DB_NAME),
      username: _config.get(Configuration.DB_USERNAME),
      password: _config.get(Configuration.DB_PASSWORD),
      //entities: [__dirname + '/../**/*.entity.{js,ts}'],
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      
      //entities: [__dirname + '/../**/**/**/*.entity{.js, .ts}'],
      migrations: [__dirname + '/migrations/*{.ts, .js}'],
      synchronize: true,
      logging: true,
    }),
  }),
];
