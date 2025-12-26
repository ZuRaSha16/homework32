import { IsNotEmpty, IsString, Length } from 'class-validator';

export class CreatePostDto {
  @IsNotEmpty()
  @IsString()
  @Length(1, 60)
  title: string;

  @IsNotEmpty()
  @IsString()
  @Length(1, 600)
  content: string;
}
