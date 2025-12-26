import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { User } from './decorators/user.decorator';
import { IsAdminGuard } from 'src/auth/guards/isAdmin.gaurd';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @UseGuards(AuthGuard)
  @Patch()
  update(@User() userId, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(userId, updateUserDto);
  }

  @UseGuards(AuthGuard)
  @Delete()
  remove(@User() userId) {
    return this.usersService.remove(userId);
  }

  @Delete(':id')
  @UseGuards(AuthGuard, IsAdminGuard)
  removeOtherUser(@Param('id') id) {
    return this.usersService.remove(id);
  }
}
