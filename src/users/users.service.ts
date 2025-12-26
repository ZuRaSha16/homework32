import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, Model } from 'mongoose';
import { User } from './schema/user.schema';
import { Post } from 'src/posts/schema/post.schema';
import { PostsService } from 'src/posts/posts.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel('user') private userModel: Model<User>,
    //added    // @InjectModel('post') private postModel: Model<any>
    @Inject(forwardRef(() => PostsService))
    private postsService: PostsService,
  ) {}
  async create(createUserDto: CreateUserDto) {
    const createUser = await this.userModel.create(createUserDto);
    return createUser;
  }

  findAll() {
    return this.userModel.find().populate('posts');
  }

  async findOneByEmail(email: string) {
    const user = await this.userModel
      .findOne({ email: email })
      .select('+password');
    return user;
  }

  async findOne(id: string) {
    const findUser = await this.userModel.findById(id);
    return findUser;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const updateUser = await this.userModel.findByIdAndUpdate(
      id,
      updateUserDto,
      { new: true },
    );
    return updateUser;
  }

  async remove(id: string) {
    if (!isValidObjectId(id)) throw new BadRequestException();
    const deletedUser = await this.userModel.findByIdAndDelete(id);
    if (!deletedUser) throw new BadRequestException();
    //added
    // await this.postModel.deleteMany({user:deletedUser._id})
    await this.postsService.removePostByUserId(deletedUser._id);
    return deletedUser;
  }

  async addPost(postId, userId) {
    const updatedUser = await this.userModel.findByIdAndUpdate(
      userId,
      { $push: { posts: postId } },
      { new: true },
    );
    return updatedUser;
  }
}
