import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsEmail, Length } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    example: 'Test Test',
    description: 'Full name of the user',
  })
  @IsNotEmpty()
  @IsString()
  fullName: string;

  @ApiProperty({
    example: 'test@gmail.com',
    description: 'User email address',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'password123',
    description: 'User password (6-20 characters)',
  })
  @IsNotEmpty()
  @IsString()
  @Length(6, 20)
  password: string;
}
