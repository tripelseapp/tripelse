import { TripInListDto } from 'trip/dto/trip/trip-list.dto';
import { TripDocument } from 'trip/entities/trip.entity';
import { getUserInList } from 'user/utils/get-users-list';
export interface TripDetailMetadata {
  active: boolean;
  areYouMember: boolean;
}
export const getTripInList = (trip: TripDocument): TripInListDto => {
  return {
    id: String(trip._id),
    name: trip.name,
    description: trip.description,
    thumbnail: trip.thumbnail,
    travelers: trip.travelers.map((traveler: any) => getUserInList(traveler)),
  };
};

export const getTripsInList = (trips: TripDocument[]): TripInListDto[] => {
  return trips.map((trip) => getTripInList(trip));
};
