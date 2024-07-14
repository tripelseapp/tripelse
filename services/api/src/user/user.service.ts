import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { plainToInstance } from 'class-transformer';
import mongoose, { FilterQuery, Model } from 'mongoose';
import { PageMetaDto } from 'src/common/dto/pagination/page-meta.dto';
import { PageOptionsDto } from 'src/common/dto/pagination/page-options.dto';
import { PageDto } from 'src/common/dto/pagination/page.dto';
import { buildQuery, buildSorting } from 'src/utils/query-utils';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserDetails, UserDetailsDto } from './dto/user-details.dto';
import { UserInListDto } from './dto/user-list.dto';
import { UserDto } from './dto/user.dto';
import { User } from './entities/user.entity';
import { getUsersDetails } from './utils/get-users-details';
import { hashPassword, comparePassword } from './utils/password-utils';
import { Role } from './types/role.types';

interface findUserOptions {
  email?: string;
  username?: string;
  id?: string;
  shy?: boolean;
}
@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  public async create(createUserDto: CreateUserDto): Promise<UserDto> {
    const now = new Date();

    const hashedPassword = await hashPassword(createUserDto.password);

    // Create a new user instance
    const newUser = new this.userModel({
      // ...createUserDto,
      username: createUserDto.username,
      email: createUserDto.email,
      createdAt: now,
      updatedAt: now,
      password: hashedPassword,
      role: 'user',
    });

    try {
      const savedUser = await newUser.save();
      // Convert savedUser to a plain object and format the response
      const userObj = savedUser.toObject();
      const userDto = {
        ...userObj,
        id: String(userObj._id),
        password: undefined, // Exclude the password field
        _id: undefined, // Exclude the _id field
        __v: undefined, // Exclude the __v field
      };
      return plainToInstance(UserDto, userDto);
    } catch (error) {
      console.error('Error saving user:', error);
      throw new Error('Could not save the user.');
    }
  }
  public async findAll(
    pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<UserInListDto>> {
    const {
      page = 1,
      take = 10,
      orderBy = ['createdAt:ASC'],
      search,
      startDate,
      endDate,
    } = pageOptionsDto;

    const skip = (page - 1) * take;
    const query = buildQuery<User>({
      model: this.userModel,
      filters: { search, startDate, endDate },
      searchIn: ['username', 'email'],
      fields: ['username'],
    });

    const usersQuery = query
      .skip(skip)
      .limit(take)
      .lean()
      .sort(buildSorting(orderBy));

    try {
      const [users, itemCount]: [FilterQuery<User>[], number] =
        await Promise.all([
          usersQuery.exec(),
          this.userModel.countDocuments().exec(),
        ]);

      const formattedUsers: UserInListDto[] = users.map((user) => ({
        id: user._id.toString(),
        username: user.username,
      }));

      const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });
      return new PageDto(formattedUsers, pageMetaDto);
    } catch (error) {
      if (error instanceof Error) {
        const message = `Error while fetching users. Error: ${error.message}`;
        throw new Error(message);
      }
      throw new Error('Error while fetching users.');
    }
  }
  public async update(id: string, data: UpdateUserDto): Promise<User | null> {
    try {
      const newUser = { ...data, updatedAt: new Date() };
      return this.userModel
        .findByIdAndUpdate(id, newUser, { new: true })
        .lean()
        .exec();
    } catch (err) {
      throw new NotFoundException('User not found');
    }
  }
  public async remove(id: string): Promise<UserDetailsDto | null> {
    const user = await this.userModel.findByIdAndDelete(id).lean().exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const parsedUser = getUsersDetails(user);
    return parsedUser;
  }
  public async findByUsernameOrEmail(
    usernameOrEmail: string,
  ): Promise<UserDetailsDto | null> {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isEmail = emailRegex.test(usernameOrEmail);

    const user = await this.findUser({
      [isEmail ? 'email' : 'username']: usernameOrEmail,
    });

    return user;
  }
  public async findUser({
    email,
    username,
    id,
  }: findUserOptions): Promise<UserDetailsDto | null> {
    const user = await this.userModel
      .findOne({
        $or: [{ email }, { username }, { _id: id }],
      })
      .lean()
      .exec();
    return user ? getUsersDetails(user) : null;
  }
  async findById(id: string): Promise<UserDetails> {
    const isValidId = mongoose.isValidObjectId(id);
    if (!isValidId) {
      throw new BadRequestException('Invalid ID');
    }
    try {
      const user = await this.findUser({ id });
      if (!user) {
        throw new NotFoundException('User not found');
      }
      return user;
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException(err);
    }
  }
  public async updateRole(id: User['id'], role: Role): Promise<UserDetails> {
    const user = await this.userModel
      .findByIdAndUpdate(id, { role }, { new: true })
      .lean()
      .exec();
    if (!user) {
      throw new BadRequestException('Invalid ID');
    }

    if (user.role !== role) {
      throw new InternalServerErrorException('Could not update user role');
    }

    const parsedUser = getUsersDetails(user);

    return parsedUser;
  }
  public async updatePassword(
    id: string,
    password: string,
  ): Promise<UserDetails> {
    // check if the user already had the same password
    const oldUser = await this.userModel.findById(id, { password: 1 }).lean();
    console.log('oldUser', oldUser);
    if (!oldUser) {
      throw new BadRequestException('Invalid ID');
    }
    if (!oldUser.password) {
      throw new BadRequestException('User does not have a password');
    }
    const isSamePassword = await comparePassword(password, oldUser.password);
    if (isSamePassword) {
      throw new BadRequestException(
        'New password must be different from the old password',
      );
    }

    const hashedPassword = await hashPassword(password);

    const updatedUser = await this.userModel
      .findByIdAndUpdate(id, { password: hashedPassword }, { new: true })
      .lean()
      .exec();

    if (!updatedUser) {
      throw new BadRequestException('Invalid ID');
    }

    const parsedUser = getUsersDetails(updatedUser);

    return parsedUser;
  }
}
