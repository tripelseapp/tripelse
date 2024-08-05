import { SavedTripDto } from 'profile/dto/saved-trips/saved-trips.dto';
import { SavedTripsDocument } from 'profile/entities/saved-trips.entity';
import { getTripsInList } from 'trip/utils/get-trip-list';

export const getSavedTrips = (
  savedTripFolder: SavedTripsDocument,
): SavedTripDto => {
  return {
    name: savedTripFolder.name,
    trips: getTripsInList(savedTripFolder.trips as any),
  };
};

export const getMultipleSavedTrips = (
  folders: SavedTripsDocument[],
): SavedTripDto[] => {
  return folders.map((v) => getSavedTrips(v));
};
