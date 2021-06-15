import { Module } from '@nestjs/common';
import { ImageManagementModule } from './users/image-management/image-management.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [UsersModule, ImageManagementModule],
})
export class SystemModule {}
