import { IsEmail, IsNotEmpty } from 'class-validator';

export class EmailDto {
  @IsNotEmpty()
  @IsEmail({}, { message: 'Es necesario que ingreses un email válido' })
  email: string;
}
