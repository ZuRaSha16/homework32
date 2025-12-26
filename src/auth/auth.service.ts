import { BadRequestException, Injectable } from '@nestjs/common';
import { SignUpDto } from './dto/sign-up.dto';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { SignInDto } from './dto/sign-in.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signUp(signUpDto: SignUpDto) {
    const exsistingUser = await this.userService.findOneByEmail(
      signUpDto.email,
    );
    if (exsistingUser) throw new BadRequestException('user already exsists');
    const hashedPass = await bcrypt.hash(signUpDto.password, 10);
    await this.userService.create({ ...signUpDto, password: hashedPass });
    return 'user created successfuly';
  }

  async signIn(signInDto: SignInDto) {
    const exsistingUser = await this.userService.findOneByEmail(
      signInDto.email,
    );
    if (!exsistingUser) throw new BadRequestException('invalid credentials');
    const isPasswordEqual = await bcrypt.compare(
      signInDto.password,
      exsistingUser.password,
    );
    if (!isPasswordEqual) throw new BadRequestException('invalid credentials');

    const payLoad = {
      userId: exsistingUser._id,
      role: exsistingUser.role,
    };

    const accessToken = await this.jwtService.sign(payLoad, {
      expiresIn: '1h',
    });
    return { accessToken };
  }

  async currentUser(userId: string) {
    const user = await this.userService.findOne(userId);
    return user;
  }
}
