import { SavedTripDetailsDto } from 'profile/dto/saved-trips/saved-trips-details.dto';
import { SavedTripsDocument } from 'profile/entities/saved-trips.entity';
import { getTripsInList } from 'trip/utils/get-trip-list';

export const getSavedTrips = (
  savedTripFolder: SavedTripsDocument,
): SavedTripDetailsDto => {
  return {
    id: savedTripFolder._id.toString(),
    name: savedTripFolder.name,
    trips: getTripsInList(savedTripFolder.trips as any),
  };
};

export const getMultipleSavedTrips = (
  folders: SavedTripsDocument[],
): SavedTripDetailsDto[] => {
  return folders.map((v) => getSavedTrips(v));
};
