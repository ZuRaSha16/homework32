import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsEmail, Length } from 'class-validator';

export class SignInDto {
  @ApiProperty({
    example: 'tengo@gmail.com',
  })
  @IsEmail()
  @IsNotEmpty()
  @IsString()
  email: string;

  @ApiProperty({
    example: 'password123',
  })
  @IsNotEmpty()
  @IsString()
  @Length(6, 20)
  password: string;
}
