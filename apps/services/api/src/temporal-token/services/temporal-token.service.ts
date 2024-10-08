// temporal-token.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateTemporalTokenDto } from 'temporal-token/dto/create-temporal-token.dto';
import { TemporalTokenDto } from 'temporal-token/dto/temporal-token.dto';
import { UpdateTemporalTokenDto } from 'temporal-token/dto/update-temporal-token.dto';
import { TemporalTokenEntity } from 'temporal-token/entities/temporal-token.entity';
import {
  TemporalTokenEnum,
  TemporalTokenType,
} from 'temporal-token/types/temporal-token.types';
import { UserDto } from 'user/dto/user.dto';

@Injectable()
export class TemporalTokenService {
  constructor(
    @InjectModel(TemporalTokenEntity.name)
    private readonly tokenModel: Model<TemporalTokenEntity>,
  ) {}

  async create(
    createTemporalTokenDto: CreateTemporalTokenDto,
  ): Promise<TemporalTokenDto> {
    const { type, token, userId, expiresAt } = createTemporalTokenDto;

    // Optionally, check if a token already exists for this user and type
    await this.tokenModel.deleteMany({ userId, type });

    const newTokenData: TemporalTokenEntity = {
      type: type as TemporalTokenEnum,
      token,
      userId,
      expiresAt,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const newToken = new this.tokenModel(newTokenData);

    const savedToken = await newToken.save();
    return this.mapToResponseDto(savedToken);
  }

  async update(
    id: string,
    updateTemporalTokenDto: UpdateTemporalTokenDto,
  ): Promise<TemporalTokenDto> {
    const token = await this.tokenModel.findById(id);
    if (!token) {
      throw new NotFoundException(`Token with ID ${id} not found`);
    }

    Object.assign(token, updateTemporalTokenDto);
    const updatedToken = await token.save();
    return this.mapToResponseDto(updatedToken);
  }

  async findOne(id: string): Promise<TemporalTokenDto> {
    const token = await this.tokenModel.findById(id);
    if (!token) {
      throw new NotFoundException(`Token with ID ${id} not found`);
    }
    return this.mapToResponseDto(token);
  }

  async delete(id: string): Promise<void> {
    const result = await this.tokenModel.deleteOne({ _id: id });
    if (result.deletedCount === 0) {
      throw new NotFoundException(`Token with ID ${id} not found`);
    }
  }
  async deleteByToken(token: string): Promise<void> {
    const result = await this.tokenModel.deleteOne({ token });
    if (result.deletedCount === 0) {
      throw new NotFoundException(`Token with token ${token} not found`);
    }
  }

  private mapToResponseDto(token: TemporalTokenEntity): TemporalTokenDto {
    return {
      type: token.type,
      token: token.token,
      userId: token.userId,
      expiresAt: token.expiresAt,
      createdAt: token.createdAt,
      updatedAt: token.updatedAt,
    };
  }

  /**
   * Validate a token and return the user ID
   * @param token The string token to validate
   * @param type The type of token to validate
   * @returns The user ID associated with the token
   */
  async validateToken(
    token: string,
    type: TemporalTokenType,
  ): Promise<UserDto['id']> {
    // find an item of this type with this token in the database
    const tokenEntity = await this.tokenModel.findOne({ token, type });
    if (!tokenEntity) {
      throw new NotFoundException('Token not found');
    }

    // check if the token has expired
    if (tokenEntity.expiresAt < new Date()) {
      // delete the token
      await this.delete(tokenEntity.id);
      throw new NotFoundException('Token has expired');
    }

    return tokenEntity.userId;
  }
}
