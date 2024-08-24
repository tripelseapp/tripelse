import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { UserEntity } from '../entities/user.entity';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ExampleUserDetailsDto } from '../dto/user-details.dto';

describe('UserService', () => {
  let service: UserService;
  let model: Model<UserEntity>;
  const mockUserService = {
    create: jest.fn(),
    findAll: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    findByUsernameOrEmail: jest.fn(),
    findUser: jest.fn(),
    findById: jest.fn(),
  };
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getModelToken(UserEntity.name),
          useValue: mockUserService,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    model = module.get<Model<UserEntity>>(getModelToken(UserEntity.name));
  });

  describe('findById function', () => {
    it('should find and return a book by Id', async () => {
      jest
        .spyOn(model, 'findById')
        .mockReturnValue(ExampleUserDetailsDto as any);

      const result = await service.findById(ExampleUserDetailsDto.id);

      expect(result).toBeDefined();
      expect(model.findById).toHaveBeenCalledWith(ExampleUserDetailsDto.id);
      expect(result).toEqual(ExampleUserDetailsDto);
    });
  });
});
