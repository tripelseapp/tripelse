import { UserDetails } from 'user/dto/user-details.dto';
import { ProfileDocument } from '../../profile/entities/profile.entity';
import { UserDocument } from '../../user/entities/user.entity';
import { ProfileDetails } from 'profile/dto/profile-details.dto';

export interface PopulatedUserDocument extends Omit<UserDocument, 'profile'> {
  profile: ProfileDocument;
}
export interface PopulatedUser extends UserDetails {
  profile: ProfileDetails;
}
