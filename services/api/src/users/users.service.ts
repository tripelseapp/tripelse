import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/CreateUser.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  /**
   * Create a new user with encrypted password.
   * @param createUserDto - Data Transfer Object containing user details.
   * @returns The newly created user.
   */
  async createUser(createUserDto: CreateUserDto): Promise<User> {
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

  /**
   * List all users.
   * @returns An array of all users.
   */
  listUsers(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  /**
   * Check if a username exists.
   * @param username - The username to check.
   * @returns True if the username exists, false otherwise.
   */
  async checkIfUsernameExists(username: User['username']): Promise<boolean> {
    const user = await this.findUserByUsername(username);
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
    return this.findUserByUsername(usernameOrEmail);
  }

  /**
   * Validate a user's password.
   * @param usernameOrEmail - The username or email of the user.
   * @param password - The password to validate.
   * @returns True if the password is valid, false otherwise.
   */
  private async validatePassword(
    usernameOrEmail: string,
    password: string,
  ): Promise<boolean> {
    const user = await this.findUserByUsernameOrEmail(usernameOrEmail);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return bcrypt.compare(password, user.password);
  }

  /**
   * Log in a user by validating their username/email and password.
   * @param usernameOrEmail - The username or email of the user.
   * @param password - The password of the user.
   * @returns The logged-in user.
   */
  async loginUser(usernameOrEmail: string, password: string): Promise<User> {
    const user = await this.findUserByUsernameOrEmail(usernameOrEmail);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const isPasswordValid = await this.validatePassword(
      usernameOrEmail,
      password,
    );
    if (!isPasswordValid) {
      throw new BadRequestException('Invalid password');
    }
    return user;
  }

  /**
   * Hash a password using bcrypt.
   * @param password - The password to hash.
   * @returns The hashed password.
   */
  private async hashPassword(password: string): Promise<string> {
    const saltRounds = 10; // Adjust the number of salt rounds as needed
    return bcrypt.hash(password, saltRounds);
  }

  /**
   * Find a user by username.
   * @param username - The username to search for.
   * @returns The found user or null if not found.
   */
  private async findUserByUsername(username: string): Promise<User | null> {
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

  async deleteUser(id: string): Promise<User | null> {
    return this.userModel.findByIdAndDelete(id).exec();
  }

  async updateUser(id: string, data: Partial<User>): Promise<User | null> {
    try {
      return this.userModel.findByIdAndUpdate(id, data, { new: true }).exec();
    } catch (err) {
      throw new NotFoundException('User not found');
    }
  }

  async updatePassword(
    id: string,
    password: User['password'],
  ): Promise<User | null> {
    const hashedPassword = await this.hashPassword(password);
    return this.userModel
      .findByIdAndUpdate(id, { password: hashedPassword }, { new: true })
      .exec();
  }
}
