import { CreateTripDto } from 'trip/dto/trip/create-trip.dto';

export interface EventPayloads {
  'user.welcome': { name: string; email: string };
  'user.reset-password': { name: string; email: string; link: string };
  'user.verify-email': { name: string; email: string; otp: string };
  'trip.invitation': {
    email: string;
    trip: CreateTripDto;
    currentUserId: string;
  };
}
