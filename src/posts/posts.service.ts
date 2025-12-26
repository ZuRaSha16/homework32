import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Post } from './schema/post.schema';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class PostsService {
  constructor(
    @InjectModel('post') private postModel: Model<any>,

    @Inject(forwardRef(() => UsersService))
    private userService: UsersService,
  ) {}

  async create(userId, createPostDto: CreatePostDto) {
    const newPost = await this.postModel.create({
      ...createPostDto,
      user: userId,
    });
    await this.userService.addPost(newPost._id, userId);
    return newPost;
  }

  findAll() {
    return this.postModel.find().populate('user');
  }

  async findOne(id: string) {
    const user = await this.postModel.findById(id).populate('user');
    return user;
  }

  async update(id: string, updatePostDto: UpdatePostDto) {
    const UpdatePost = await this.postModel.findByIdAndUpdate(
      id,
      updatePostDto,
      { new: true },
    );
    return UpdatePost;
  }

  async remove(id: string) {
    const deletePost = await this.postModel.findByIdAndDelete(id);
    return deletePost;
  }

  async removePostByUserId(id) {
    await this.postModel.deleteMany({ user: id });
  }
}
