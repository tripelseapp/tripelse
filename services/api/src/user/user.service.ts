import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { hash } from 'bcrypt';
import { FilterQuery, Model } from 'mongoose';
import { PageMetaDto } from 'src/common/dto/pagination/page-meta.dto';
import { PageOptionsDto } from 'src/common/dto/pagination/page-options.dto';
import { PageDto } from 'src/common/dto/pagination/page.dto';
import { buildQuery, buildSorting } from 'src/utils/query-utils';
import { CreateUserDto } from './dto/create-user.dto';
import { SafeUser } from './dto/safe-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserDetails, UserDetailsDto } from './dto/user-details.dto';
import { User } from './entities/user.entity';
import { plainToInstance } from 'class-transformer';
import { UserDto } from './dto/user.dto';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async create(createUserDto: CreateUserDto): Promise<UserDto> {
    const now = new Date();

    const hashedPassword = await this.hashPassword(createUserDto.password);

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
  ): Promise<PageDto<SafeUser>> {
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

      const formattedUsers: SafeUser[] = users.map((user) => ({
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

  async update(id: string, data: UpdateUserDto): Promise<User | null> {
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

  async remove(id: string): Promise<User | null> {
    return this.userModel.findByIdAndDelete(id).exec();
  }

  /**
   * Check if a username exists.
   * @param username - The username to check.
   * @returns True if the username exists, false otherwise.
   */
  async findByUsernameOrEmail(
    usernameOrEmail: UserDto['username' | 'email'],
  ): Promise<UserDetailsDto> {
    const user = await this.retrieveUserByUsernameOrEmail(usernameOrEmail);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return this.getUsersDetails(user);
  }

  /**
   * Find a user by username or email.
   * @param usernameOrEmail - The username or email to search for.
   * @returns The found user or null if not found.
   */
  private async retrieveUserByUsernameOrEmail(
    usernameOrEmail: string,
  ): Promise<User | null> {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isEmail = emailRegex.test(usernameOrEmail);
    if (isEmail) {
      return this.findUserByEmail(usernameOrEmail);
    }
    return this.findByUsername(usernameOrEmail);
  }

  /**
   * Hash a password using bcrypt.
   * @param password - The password to hash.
   * @returns The hashed password.
   */
  private async hashPassword(password: string): Promise<string> {
    const saltRounds = 10; // Adjust the number of salt rounds as needed
    return hash(password, saltRounds);
  }

  /**
   * Find a user by username.
   * @param username - The username to search for.
   * @returns The found user or null if not found.
   */
  async findByUsername(username: string): Promise<User | null> {
    return this.userModel.findOne({ username }).exec();
  }

  /**
   * Find a user by email.
   * @param email - The email to search for.
   * @returns The found user or null if not found.
   */
  async findUserByEmail(email: string): Promise<User | null> {
    return this.userModel
      .findOne({
        email,
      })
      .exec();
  }

  private getUsersDetails = (user: User): UserDetails => {
    // If no changes have been made to the user, updatedAt will be null so we use createdAt instead

    const updatedDate =
      user.updatedAt?.toISOString() ?? user.createdAt.toISOString();

    return {
      id: String(user._id),
      username: user.username,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt.toISOString(),
      updatedAt: updatedDate,
    };
  };

  async findUserById(id: string): Promise<UserDetails | null> {
    try {
      const user = await this.userModel.findById(id).lean().exec();
      if (!user) {
        throw new NotFoundException('User not found');
      }
      const parsedUser = this.getUsersDetails(user);
      return parsedUser;
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException(err);
    }
  }
}
