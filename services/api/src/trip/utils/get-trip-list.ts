import { TripInListDto } from 'trip/dto/trip/trip-list.dto';
import { TripDocument } from 'trip/entities/trip.entity';
import { UserDocument } from 'user/entities/user.entity';
import { getUsersInList } from 'user/utils/get-users-list';
export interface TripDetailMetadata {
  active: boolean;
  areYouMember: boolean;
}
export const getTripInList = (trip: TripDocument): TripInListDto => {
  const { budget, name, description, duration, purposes, moods, thumbnail } =
    trip;

  return {
    id: String(trip._id),
    name,
    thumbnail,
    description,
    budget,
    duration,
    purposes,
    moods,
    travelers: getUsersInList(trip.travelers as unknown as UserDocument[]),
  };
};

export const getTripsInList = (trips: TripDocument[]): TripInListDto[] => {
  const array = trips || [];
  return array.map((trip) => getTripInList(trip));
};
