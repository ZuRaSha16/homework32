import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { IsAdminGuard } from 'src/auth/guards/isAdmin.gaurd';
import { User } from './decorators/user.decorator';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOkResponse,
  ApiBadRequestResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Users')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @UseGuards(AuthGuard)
  @ApiBody({ type: CreateUserDto })
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @ApiOkResponse({
    example: [
      {
        _id: '694d69f99a21ac40ff541646',
        fullName: 'Test Test',
        email: 'test@gmail.com',
        role: 'user',
        posts: [],
        createdAt: '2025-12-25T16:44:41.901Z',
        updatedAt: '2025-12-25T16:44:41.901Z',
      },
    ],
  })
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  @ApiParam({ name: 'id', type: String })
  @ApiOkResponse({
    example: {
      _id: '694d69f99a21ac40ff541646',
      fullName: 'Test Test',
      email: 'test@gmail.com',
      role: 'user',
      posts: [],
    },
  })
  @ApiBadRequestResponse({
    example: {
      statusCode: 400,
      message: 'Invalid user ID',
    },
  })
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Patch()
  @UseGuards(AuthGuard)
  @ApiBody({ type: UpdateUserDto })
  update(@User() userId: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(userId, updateUserDto);
  }

  @Delete()
  @UseGuards(AuthGuard)
  remove(@User() userId: string) {
    return this.usersService.remove(userId);
  }

  @Delete(':id')
  @UseGuards(AuthGuard, IsAdminGuard)
  @ApiParam({ name: 'id', type: String })
  removeOtherUser(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
