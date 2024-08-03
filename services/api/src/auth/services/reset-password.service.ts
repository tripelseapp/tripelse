import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { TemporalTokenService } from 'temporal-token/services/temporal-token.service';
import { UserService } from 'user/services/user.service';
import { hashPassword } from 'user/utils/password-utils';
import { passwordStrongEnough } from 'utils/password-checker';

@Injectable()
export class ResetPasswordService {
  constructor(
    private readonly userService: UserService,
    private readonly tokenService: TemporalTokenService,
  ) {}

  public async updatePassword(
    token: string,
    newPassword: string,
  ): Promise<void> {
    // Validate token
    const userId = await this.tokenService.validateToken(
      token,
      'password_reset',
    );
    if (!userId) {
      throw new BadRequestException('Invalid or expired token');
    }

    // Validate new password
    const { strongEnough, reason } = passwordStrongEnough(newPassword);

    if (!strongEnough && reason?.length) {
      throw new BadRequestException(reason);
    }

    const password = await hashPassword(newPassword);
    try {
      await this.userService.update(userId, { password });
    } catch (error) {
      console.error('Error saving user:', error);
      throw new InternalServerErrorException('Could not save the user.');
    }

    // Delete the token after successful password reset
    try {
      await this.tokenService.deleteByToken(token);
    } catch (error) {
      console.error('Error deleting token:', error);
      throw new InternalServerErrorException('Could not delete the token.');
    }
  }
}
