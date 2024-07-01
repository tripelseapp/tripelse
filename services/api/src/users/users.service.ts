import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/schemas/User.schema';
import { CreateUserDto } from './dto/CreateUser.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  createUser(createUserDto: CreateUserDto) {
    const now = new Date();
    const newUser = new this.userModel({
      ...createUserDto,
      createdAt: now,
      role: 'user',
    });
    return newUser.save();
  }

  listUsers() {
    return this.userModel.find();
  }
}
