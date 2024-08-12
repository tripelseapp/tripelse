import { CreateTripDto } from 'trip/dto/trip/create-trip.dto';
import { UserInList } from 'user/dto/user-list.dto';

export interface EventPayloads {
  'user.welcome': { name: string; email: string; username: string };
  'user.reset-password': { name: string; email: string; link: string };
  'user.verify-email': { name: string; email: string; otp: string };
  'trip.invitation.known': {
    email: string;
    trip: CreateTripDto;
    creator: UserInList;
    receptor: UserInList;
  };
  'trip.invitation.unknown': {
    email: string;
    trip: CreateTripDto;
    creator: UserInList;
  };

  'user.password.reset': { email: string; resetUrl: string; username: string };
  'user.email.validate': { email: string; url: string; username: string };
}
