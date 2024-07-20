import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PageMetaDto } from 'common/resources/pagination';
import { PageOptionsDto } from 'common/resources/pagination/page-options.dto';
import { PageDto } from 'common/resources/pagination/page.dto';
import mongoose, { FilterQuery, Model } from 'mongoose';
import { buildQuery, buildSorting } from 'utils/query-utils';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserDetails, UserDetailsDto } from './dto/user-details.dto';
import { UserInListDto } from './dto/user-list.dto';
import { UserDocument, UserEntity } from './entities/user.entity';
import { Role } from './types/role.types';
import { getUserDetails } from './utils/get-users-details';
import { comparePassword, hashPassword } from './utils/password-utils';
import { passwordStrongEnough } from 'utils/password-checker';

interface findUserOptions {
  email?: string;
  username?: string;
  id?: string;
  shy?: boolean;
}
@Injectable()
export class UserService {
  constructor(
    @InjectModel(UserEntity.name)
    private userModel: Model<UserDocument>,
  ) {}

  public async create(createUserDto: CreateUserDto): Promise<UserDocument> {
    console.log('Checking if username exists');
    const usernameExists = await this.findByUsernameOrEmail(
      createUserDto.username,
    );
    if (usernameExists) {
      throw new BadRequestException('Username already exists');
    }
    console.log('Checking if email exists');

    const emailExists = await this.findUser({
      email: createUserDto.email,
    });
    if (emailExists) {
      throw new BadRequestException('Email already exists');
    }

    console.log('Checking if password is strong enough');

    // is pass strong enough?
    const { strongEnough, reason } = passwordStrongEnough(
      createUserDto.password,
    );

    if (!strongEnough && reason?.length) {
      throw new BadRequestException(reason);
    }
    const now = new Date();

    // Create a new user instance
    const newUser = new this.userModel({
      // ...createUserDto,
      username: createUserDto.username,
      email: createUserDto.email,
      password: createUserDto.password,
      createdAt: now,
      updatedAt: now,
      role: 'user',
    });

    try {
      return await newUser.save();
    } catch (error) {
      console.error('Error saving user:', error);
      throw new Error('Could not save the user.');
    }
  }

  public async createMultiple(
    createUserDtos: CreateUserDto[],
  ): Promise<UserDetails[]> {
    const now = new Date();
    const newUsers = createUserDtos.map((createUserDto) => {
      return new this.userModel({
        username: createUserDto.username,
        email: createUserDto.email,
        password: createUserDto.password,
        createdAt: now,
        updatedAt: now,
        role: 'user',
      });
    });

    try {
      const usersInserted = await this.userModel.insertMany(newUsers);
      const formattedUsers = usersInserted.map((user) => getUserDetails(user));
      return formattedUsers;
    } catch (error) {
      console.error('Error saving users:', error);
      throw new Error('Could not save the users.');
    }
  }

  public async findAll(
    pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<UserInListDto>> {
    const {
      page = 1,
      take = 10,
      orderBy = ['createdAt:DESC'],
      search,
      startDate,
      endDate,
    } = pageOptionsDto;

    const skip = (page - 1) * take;
    const query = buildQuery<UserDocument>({
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
      const [users, itemCount]: [FilterQuery<UserEntity>[], number] =
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
  public async update(id: string, data: UpdateUserDto): Promise<UserDetails> {
    try {
      const newUser = { ...data, updatedAt: new Date() };
      const savedUser = (await this.userModel
        .findByIdAndUpdate(id, newUser, { new: true })
        .lean()
        .exec()) as UserDocument | null;

      if (!savedUser) {
        throw new NotFoundException('User not found');
      }
      return getUserDetails(savedUser);
    } catch (err) {
      throw new NotFoundException('User not found');
    }
  }
  public async remove(id: string): Promise<UserDetailsDto | null> {
    const user = await this.userModel.findByIdAndDelete(id).lean().exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const parsedUser = getUserDetails(user);
    return parsedUser;
  }
  public async findByUsernameOrEmail(
    usernameOrEmail: string,
  ): Promise<UserDocument | null> {
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
  }: findUserOptions): Promise<UserDocument | null> {
    // Be case sensitive, compare the email and username in lowercase
    const user = await this.userModel
      .findOne({
        $or: [
          { email: new RegExp(`^${email?.toLowerCase()}$`, 'i') },
          { username: new RegExp(`^${username?.toLowerCase()}$`, 'i') },
          { _id: id },
        ],
      })
      .select('+password')
      .lean()
      .exec();
    return user;
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
      return getUserDetails(user);
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException(err);
    }
  }
  public async updateRole(
    id: UserDocument['id'],
    role: Role,
  ): Promise<UserDetails> {
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

    const parsedUser = getUserDetails(user);

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

    const parsedUser = getUserDetails(updatedUser);

    return parsedUser;
  }
}
