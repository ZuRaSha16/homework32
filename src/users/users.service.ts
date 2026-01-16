import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './schema/user.schema';
import { PostsService } from 'src/posts/posts.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel('user') private userModel: Model<User>,
    @Inject(forwardRef(() => PostsService))
    private postsService: PostsService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    return this.userModel.create(createUserDto);
  }

  async findAll() {
    return this.userModel.find().populate('posts');
  }

  async findOne(id: string) {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('Invalid user ID');
    }

    const user = await this.userModel.findById(id);
    if (!user) throw new BadRequestException('User not found');

    return user;
  }

  async findOneByEmail(email: string) {
    return this.userModel.findOne({ email }).select('+password');
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('Invalid user ID');
    }

    const updatedUser = await this.userModel.findByIdAndUpdate(
      id,
      updateUserDto,
      { new: true },
    );

    if (!updatedUser) throw new BadRequestException('User not found');

    return updatedUser;
  }

  async remove(id: string) {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('Invalid user ID');
    }

    const deletedUser = await this.userModel.findByIdAndDelete(id);
    if (!deletedUser) throw new BadRequestException('User not found');

    await this.postsService.removePostByUserId(deletedUser._id);

    return deletedUser;
  }

  async addPost(postId: string, userId: string) {
    return this.userModel.findByIdAndUpdate(
      userId,
      { $push: { posts: postId } },
      { new: true },
    );
  }
}
