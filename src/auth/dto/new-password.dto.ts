import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { IsString, Matches } from 'class-validator';

export class NewPasswordDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Matches(/^(?!.*\s)(?=.*[A-Z])(?=.*[0-9])(?=.*[a-z]).{8,250}$/)
  password: string;
}
