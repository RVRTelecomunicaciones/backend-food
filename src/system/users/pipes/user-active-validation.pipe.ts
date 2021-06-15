import { BadRequestException, ForbiddenException } from '@nestjs/common/exceptions';
import { PipeTransform } from '@nestjs/common/interfaces/features/pipe-transform.interface';
import { UserStatus } from '../user-status.enum';
import { User } from '../users.entity';

export class UserActiveValidationPipe implements PipeTransform {
  transform(user: User) {
    if (user.status === UserStatus.INACTIVO) {
      throw new ForbiddenException('Healthy dev le informa que debe activar la cuenta por email primero.');
    }
    if (user.status !== UserStatus.ACTIVO) {
      throw new BadRequestException(
        `Healthy dev no reconoce el estado "${status}" como un estado del usuario no válido`,
      );
    }
    return user;
  }
}
