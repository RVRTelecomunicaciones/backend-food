import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { ImageManagementModule } from './image-management/image-management.module';
import { TypeOrmModule } from '@nestjs/typeorm/dist/typeorm.module';
import { UserRepository } from './user.repository';
import { TokensModule } from '../../tokens/tokens.module';

@Module({
  providers: [UsersService],
  exports: [UsersService],
  controllers: [UsersController],
  imports: [TypeOrmModule.forFeature([UserRepository]), ImageManagementModule, TokensModule],
})
export class UsersModule {}
