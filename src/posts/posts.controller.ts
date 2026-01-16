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
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { User } from 'src/users/decorators/user.decorator';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiOkResponse,
  ApiResponse,
} from '@nestjs/swagger';

@ApiBearerAuth()
// @UseGuards(AuthGuard)
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  @UseGuards(AuthGuard)
  create(@User() userId, @Body() createPostDto: CreatePostDto) {
    return this.postsService.create(userId, createPostDto);
  }

  @ApiResponse({
    example: {
      _id: '694d69f99a21ac40ff541646',
      fullName: 'nika nikadze',
      email: 'nika@gmail.com',
      role: 'user',
      posts: [],
      createdAt: '2025-12-25T16:44:41.901Z',
      updatedAt: '2025-12-25T16:44:41.901Z',
      __v: 0,
    },
  })
  @Get()
  findAll() {
    return this.postsService.findAll();
  }

  @ApiOkResponse({
    example: {
      _id: '6966767907a73863600341f5',
      title: 'title 1',
      content: 'content 1',
      user: {
        _id: '69666d200b37339ad89236bd',
        fullName: 'tengo tengodze',
        email: 'tengo55@gmail.com',
        role: 'user',
        posts: ['6966767907a73863600341f5'],
        createdAt: '2026-01-13T16:04:48.778Z',
        updatedAt: '2026-01-13T16:44:41.280Z',
        __v: 0,
      },
      createdAt: '2026-01-13T16:44:41.200Z',
      updatedAt: '2026-01-13T16:44:41.200Z',
      __v: 0,
    },
  })
  @ApiBadRequestResponse({
    example: {
      messsage: 'bad request',
      status: 400,
    },
  })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.postsService.findOne(id);
  }

  @ApiOkResponse({
    example: {
      _id: '6966767907a73863600341f5',
      title: 'updated value',
      content: 'updated value',
      user: {
        _id: '69666d200b37339ad89236bd',
        fullName: 'tengo tengodze',
        email: 'tengo@gmail.com',
        role: 'user',
        posts: ['6966767907a73863600341f5'],
        createdAt: '2026-01-13T16:04:48.778Z',
        updatedAt: '2026-01-13T16:44:41.280Z',
        __v: 0,
      },
      createdAt: '2026-01-13T16:44:41.200Z',
      updatedAt: '2026-01-13T16:44:41.200Z',
      __v: 0,
    },
  })
  @ApiBadRequestResponse({
    example: {
      messsage: 'bad request',
      status: 400,
    },
  })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
    return this.postsService.update(id, updatePostDto);
  }
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.postsService.remove(id);
  }
  @UseGuards(AuthGuard)
  @Delete('user/:userId')
  deletePostsByUser(@Param('userId') userId: string) {
    return this.postsService.removePostByUserId(userId);
  }
}
