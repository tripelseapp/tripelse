import { TripInListDto } from 'trip/dto/trip/trip-list.dto';
import { TripDocument } from 'trip/entities/trip.entity';
import { UserDocument } from 'user/entities/user.entity';
import { getUsersInList } from 'user/utils/get-users-list';
import { getTripDuration } from './get-trip-duration.utils';
export interface TripDetailMetadata {
  active: boolean;
  areYouMember: boolean;
}
export const getTripInList = (trip: TripDocument): TripInListDto => {
  return {
    id: String(trip._id),
    name: trip.name,
    description: trip.description,
    duration: getTripDuration(trip.days?.length ?? 0),
    thumbnail: trip.thumbnail,
    travelers: getUsersInList(trip.travelers as unknown as UserDocument[]),
    moods: trip.moods,
  };
};

export const getTripsInList = (trips: TripDocument[]): TripInListDto[] => {
  const array = trips || [];
  return array.map((trip) => getTripInList(trip));
};
