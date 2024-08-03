import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { TemporalTokenService } from 'temporal-token/services/temporal-token.service';
import { TemporalTokenEnum } from 'temporal-token/types/temporal-token.types';
import { UserService } from 'user/services/user.service';

@Injectable()
export class ValidateUserService {
  constructor(
    private readonly userService: UserService,
    private readonly tokenService: TemporalTokenService,
  ) {}

  public async validateEmail(token: string): Promise<void> {
    // Validate token
    const userId = await this.tokenService.validateToken(
      token,
      TemporalTokenEnum.email_verification,
    );
    if (!userId) {
      throw new BadRequestException('Invalid or expired token');
    }
    const emailVerified = new Date().toISOString();
    const partialUser = { emailVerified };

    try {
      const newUser = await this.userService.update(userId, partialUser);
      if (!newUser) {
        throw new InternalServerErrorException('Could not save the user.');
      }
    } catch (error) {
      console.error('Error saving user:', error);
      throw new InternalServerErrorException('Something went wrong.');
    }

    // Delete the token after successful email verification
    try {
      await this.tokenService.deleteByToken(token);
    } catch (error) {
      console.error('Error deleting token:', error);
      throw new InternalServerErrorException('Could not delete the token.');
    }
  }
}
