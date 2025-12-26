import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Role } from 'src/enums/user.enum';

@Schema({ timestamps: true })
export class User {
  @Prop({ type: String })
  fullName: string;

  @Prop({ type: String })
  email: string;

  @Prop({ type: String, select: false })
  password: string;

  @Prop({ type: String, default: Role.USER })
  role: string;

  @Prop({ type: [mongoose.Schema.Types.ObjectId], ref: 'post', default: [] })
  posts: mongoose.Schema.Types.ObjectId[];
}

export const userschema = SchemaFactory.createForClass(User);
