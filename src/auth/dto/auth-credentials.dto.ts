import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, Length } from 'class-validator';
import { IsString, Matches } from 'class-validator';

export class AuthCredentialsDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Length(4, 100)
  usernameOrEmail: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Matches(/^(?!.*\s)(?=.*[A-Z])(?=.*[0-9])(?=.*[a-z]).{8,250}$/)
  password: string;
}
