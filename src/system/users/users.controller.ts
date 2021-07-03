import {
  Controller,
  Get,
  UseGuards,
  Put,
  Body,
  ValidationPipe,
  ParseIntPipe,
  Param,
  BadRequestException,
  Delete,
  Query,
  Post,
} from '@nestjs/common';
import { UsersService } from './users.service';

import { AuthGuard } from '@nestjs/passport';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserPreviewDto } from './dto/user-preview.dto';
import { GetUser } from '../../auth/get-user.decorator';
import { User } from './users.entity';
import { TokenDto } from '../../auth/dto/tokens.dto';
import { ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from './dto/create-user.dto';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) { }

  @Get('v1/users/me')
  @UseGuards(AuthGuard('jwt'))
  async getProfile(@GetUser() { username }: User): Promise<{ user: {} }> {
    return this.userService.getUser(username);
  }

  @Get('v1/users/:id')
  getUserById(@Param('id', ParseIntPipe) id: number): Promise<UserPreviewDto> {
    return this.userService.getUserById(id);
  }

  @Delete('v1/users/')
  async deleteUserByToken(@Query() tokenDto: TokenDto): Promise<{ message: string }> {
    return this.userService.deleteUserByToken(tokenDto);
  }

  @Post('v1/users/create')
  async createUser(@Body() createUserDto: CreateUserDto) {

    const userId = await this.userService.createUser(createUserDto);
    return userId;
  }

  @Put('v1/users/me')
  @UseGuards(AuthGuard('jwt'))
  async updateUser(
    @GetUser() { username }: User,
    @Body()
    updateData: UpdateUserDto,
  ): Promise<{ message: string }> {
    if (Object.keys(updateData).length === 0) {
      throw new BadRequestException(
        'Debe modificar al menos alguno de los campos, nombre, foto de perfil, links de instagram o twitter.',
      );
    }
    return this.userService.updateUser(updateData, username);
  }
}
