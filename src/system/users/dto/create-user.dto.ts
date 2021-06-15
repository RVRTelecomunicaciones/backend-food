import { Length, IsString, Matches, IsEmail } from 'class-validator';

export class CreateUserDto {
  @IsEmail({}, { message: 'Ingrese un email válido' })
  email: string;

  @IsString({ message: 'Ingrese un texto en el nombre de usuario.' })
  @Matches(/(?=^.{4,20}$)^[a-zA-Z]+[a-zA-Z\-\_0-9.]+[a-zA-Z0-9]+$/, {
    message:
      'La cuenta de usuario puede contener letras, números y caracteres en el nombre de usuario. Largo de 4 a 20.',
  })
  username: string;

  @Matches(/^(?!.*\s)(?=.*[A-Z])(?=.*[0-9])(?=.*[a-z]).{8,250}$/, {
    message:
      'El password debe contener al menos una mayúscula, numeros y caracteres. Largo entre 8 y 250 caracteres',
  })
  password: string;
}
