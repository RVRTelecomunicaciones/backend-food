import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class EmailDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsEmail({}, { message: 'Es necesario que ingreses un email válido' })
  email: string;
}
