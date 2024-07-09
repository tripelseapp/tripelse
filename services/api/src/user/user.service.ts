import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { hash } from 'bcrypt';
import { Model } from 'mongoose';
import { PageMetaDto } from 'src/common/dto/pagination/page-meta.dto';
import { PageOptionsDto } from 'src/common/dto/pagination/page-options.dto';
import { PageDto } from 'src/common/dto/pagination/page.dto';
import {
  buildQuery,
  buildSorting,
  buildSortOptions,
} from 'src/utils/query-utils';
import { CreateUserDto } from './dto/create-user.dto';
import { SafeUser } from './dto/safe-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserDocument } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const now = new Date();

    // Encrypt the password
    const hashedPassword = await this.hashPassword(createUserDto.password);

    // Create a new user instance
    const newUser = new this.userModel({
      ...createUserDto,
      createdAt: now,
      updatedAt: now,
      password: hashedPassword,
      role: 'user',
    });

    return newUser.save();
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
    const query = buildQuery<UserDocument>({
      model: this.userModel,
      filters: { search, startDate, endDate },
      searchIn: ['username', 'email'],
      fields: ['username'],
    });

    const usersQuery = query.skip(skip).limit(take).sort(buildSorting(orderBy));

    try {
      const [users, itemCount] = await Promise.all([
        usersQuery.exec(),
        this.userModel.countDocuments().exec(),
      ]);

      const formattedUsers: SafeUser[] = users.map((user) => ({
        id: user._id.toString(),
        username: user.username,
        email: 'e',
      }));

      const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });
      return new PageDto(formattedUsers, pageMetaDto);
    } catch (error) {
      throw new Error(`Error fetching users: ${error.message}`);
    }
  }

  async update(id: string, data: UpdateUserDto): Promise<User | null> {
    try {
      return this.userModel.findByIdAndUpdate(id, data, { new: true }).exec();
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
  async checkIfUsernameExists(username: User['username']): Promise<boolean> {
    const user = await this.findByUsername(username);
    return !!user;
  }

  /**
   * Find a user by username or email.
   * @param usernameOrEmail - The username or email to search for.
   * @returns The found user or null if not found.
   */
  private async findUserByUsernameOrEmail(
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

  async findUserById(id: string): Promise<User | null> {
    try {
      return this.userModel.findById(id).exec();
    } catch (err) {
      throw new NotFoundException('User not found');
    }
  }
}
