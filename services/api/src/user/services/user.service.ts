import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { UserFromProvider } from 'auth/types/User-from-google.type';
import {
  PageDto,
  PageMetaDto,
  PageOptionsDto,
} from 'common/resources/pagination';
import { FilterQuery, Model } from 'mongoose';
import { ProfileDocument } from 'profile/entities/profile.entity';
import { ProfileService } from 'profile/services/profile.service';
import { UserDto } from 'user/dto/user.dto';
import { PopulatedUserDocument } from 'user/types/populated-user.type';
import { getUsersInList } from 'user/utils/get-users-list';
import { passwordStrongEnough } from 'utils/password-checker';
import {
  BuildQueryOptions,
  buildQueryWithCount,
  buildSorting,
} from 'utils/query-utils';
import { CreateProfileDto } from '../../profile/dto/create-profile.dto'; // Asegúrate de tener este DTO
import { CreateUserDto } from '../dto/create-user.dto';
import { UserDetails, UserDetailsDto } from '../dto/user-details.dto';
import { UserInListDto } from '../dto/user-list.dto';
import { UserDocument, UserEntity } from '../entities/user.entity';
import { Role, RolesEnum } from '../types/role.types';
import { UserBeforeCreate } from '../types/user-before-create.type';
import { getUserDetails } from '../utils/get-users-details';

interface findUserOptions {
  email?: string;
  username?: string;
  id?: string;
}

@Injectable()
export class UserService {
  constructor(
    @InjectModel(UserEntity.name)
    private userModel: Model<UserDocument>,
    private profileService: ProfileService,
  ) {}

  public async create(
    createUserDto: CreateUserDto,
  ): Promise<PopulatedUserDocument> {
    const emailOrUsernameRepeated = await this.findUser({
      email: createUserDto.email,
      username: createUserDto.username,
    });
    if (emailOrUsernameRepeated) {
      throw new ConflictException('Email or Username already exists');
    }

    if (!createUserDto.password) {
      throw new BadRequestException('Password is required');
    }

    // is pass strong enough?
    const { strongEnough, reason } = passwordStrongEnough(
      createUserDto.password,
    );

    if (!strongEnough && reason?.length) {
      throw new BadRequestException(reason);
    }
    const now = new Date();

    try {
      const newProfile = await this.profileService.create({});

      if (!newProfile._id) {
        throw new InternalServerErrorException('Could not save the profile');
      }

      const newUser: UserBeforeCreate = {
        username: createUserDto.username,
        email: createUserDto.email,
        password: createUserDto.password,
        createdAt: now,
        updatedAt: now,
        profile: newProfile._id,
        roles: [RolesEnum.USER],
      };
      // Create a new user instance
      const newUserDocument = new this.userModel(newUser);
      // Save the user
      const savedUser = await newUserDocument.save();

      return await this.findOneWithProfile(savedUser._id.toString());
    } catch (error) {
      console.error('Error saving user or profile:', error);
      throw new InternalServerErrorException(
        'Could not save the user or profile: ' + error,
      );
    }
  }
  async createWithProvider(
    data: UserFromProvider,
  ): Promise<PopulatedUserDocument> {
    const newProfile: CreateProfileDto = {
      givenName: data.givenName,
      familyName: data.familyName,
      avatar: data.avatar,
    };
    try {
      const savedProfile = await this.profileService.create(newProfile);

      const newUser = new this.userModel({
        username: data.username,
        email: data.email,
        emailVerified: new Date(),
        roles: ['user'],
        socialLogins: [
          {
            provider: data.providerName,
            providerId: data.providerId,
          },
        ],
        profile: savedProfile._id,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      const savedUser = await newUser.save();
      return await this.findOneWithProfile(savedUser._id.toString());
    } catch (error) {
      console.error('Error saving user:', error);
      throw new InternalServerErrorException('Could not save the user.');
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

    const filterData: BuildQueryOptions<UserDocument> = {
      model: this.userModel,
      filters: { search, startDate, endDate },
      searchIn: ['username', 'email'],
      fields: ['username'],
    };
    const { query, countQuery } = buildQueryWithCount(filterData);

    const usersQuery = query
      .skip(skip)
      .limit(take)
      .populate('profile')
      .sort(buildSorting(orderBy));

    try {
      const [users, itemCount]: [FilterQuery<UserEntity>[], number] =
        await Promise.all([
          usersQuery.exec(),
          countQuery.countDocuments().exec(),
        ]);
      const formattedUsers: UserInListDto[] = getUsersInList(
        users as unknown as UserDocument[],
      );

      const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });
      return new PageDto(formattedUsers, pageMetaDto);
    } catch (error) {
      if (error instanceof Error) {
        const message = `Error while fetching users. Error: ${error.message}`;
        throw new InternalServerErrorException(message);
      }
      throw new InternalServerErrorException('Error while fetching users.');
    }
  }

  public async update(
    id: string,
    data: Partial<UserDto>,
  ): Promise<UserDetails> {
    try {
      const newUser = { ...data, updatedAt: new Date() };

      const savedUser = (await this.userModel
        .findByIdAndUpdate(id, newUser, { new: true })
        .lean()
        .exec()) as UserDocument | null;

      if (!savedUser) {
        throw new NotFoundException('User to save not found ');
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
    const parsedUser = getUserDetails(user as UserDocument);
    return parsedUser;
  }

  public async findByUsernameOrEmail(
    usernameOrEmail: string,
  ): Promise<PopulatedUserDocument | null> {
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
  }: findUserOptions): Promise<PopulatedUserDocument | null> {
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
      .populate('profile')
      .lean()
      .exec();

    const userPopulated = {
      ...user,
    } as unknown as PopulatedUserDocument;
    return userPopulated;
  }

  async findById(id: string): Promise<UserDetails> {
    try {
      const user = await this.userModel.findById(id).lean().exec();
      if (!user) {
        throw new NotFoundException('User not found');
      }
      return getUserDetails(user as UserDocument);
    } catch (err) {
      console.error(err);
      throw new InternalServerErrorException(err);
    }
  }

  public async addRole(
    id: UserDocument['id'],
    role: Role,
  ): Promise<UserDetails> {
    // add the new role to the user roles array only if it does not exist
    const user = await this.userModel
      .findByIdAndUpdate(id, { $addToSet: { roles: role } }, { new: true })
      .lean()
      .exec();
    if (!user) {
      throw new BadRequestException('Invalid ID');
    }

    const parsedUser = getUserDetails(user as UserDocument);

    return parsedUser;
  }

  public async deleteRole(
    id: UserDocument['id'],
    role: Role,
  ): Promise<UserDetails> {
    const user = await this.userModel
      .findByIdAndUpdate(id, { $pull: { roles: role } }, { new: true })
      .lean()
      .exec();
    if (!user) {
      throw new BadRequestException('Invalid ID');
    }

    const parsedUser = getUserDetails(user as UserDocument);

    return parsedUser;
  }

  async findOneWithProfile(id: string): Promise<PopulatedUserDocument> {
    try {
      const user = await this.userModel
        .findById(id)
        .populate({
          path: 'profile',
          populate: {
            path: 'savedTrips',
            populate: {
              path: 'trips',
              model: 'TripEntity', // Ensure the model name matches your TripEntity
            },
          },
        })
        .lean()
        .exec();
      if (!user) {
        throw new NotFoundException('User not found');
      }
      const profile = user.profile as unknown as ProfileDocument;
      return {
        ...user,
        profile,
      };
    } catch (err) {
      console.error(err);
      throw new InternalServerErrorException(err);
    }
  }
}
