import { InternalServerErrorException, ConflictException } from '@nestjs/common/exceptions';
import { EntityRepository } from 'typeorm/decorator/EntityRepository';
import { Repository } from 'typeorm/repository/Repository';
import { NewPasswordDto } from '../../auth/dto/new-password.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserStatus } from './user-status.enum';
import { User } from './users.entity';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async getUserByUsernameOrEmail(usernameOrEmail: string): Promise<User> {
    const query = this.createQueryBuilder('user');
    query.where('user.username = :usernameOrEmail', {
      usernameOrEmail,
    });
    query.orWhere('user.email = :usernameOrEmail', {
      usernameOrEmail,
    });
    const user = await query.getOne();
    return user;
  }

  async createUser(createUserDto: CreateUserDto, photoUrl: string, active?: boolean): Promise<{ id: number }> {
    const { email, username, password } = createUserDto;
    const user = this.create();
    user.email = email;
    user.username = username;
    user.password = password;
    user.profilePhoto = photoUrl;
    user.status = active ? UserStatus.ACTIVO : user.status;
    try {
      await user.save();
    } catch (error) {
      if (error.code === '23505') {
        if (error.detail.includes('email')) {
          throw new ConflictException('Ya hay un usuario registrado con ese email');
        }
        if (error.detail.includes('username')) {
          throw new ConflictException('El nombre de usuario ya esta en uso.');
        }
        throw new ConflictException(error.detail);
      } else {
        throw new InternalServerErrorException();
      }
    }

    return { id: user.id };
  }

  async updateUser(updateData: UpdateUserDto, username: string): Promise<{ message: string }> {
    await this.update({ username }, updateData);
    return {
      message: 'El usuario ha sido actualizado con éxito',
    };
  }

  async changePassword(newPassword: NewPasswordDto, username: string): Promise<{ message: string }> {
    const passwordChangedAt = new Date();
    const { password } = newPassword;
    await this.update({ username }, { password, passwordChangedAt });
    return {
      message: 'Contraseña Cambiada con éxito.',
    };
  }
}
