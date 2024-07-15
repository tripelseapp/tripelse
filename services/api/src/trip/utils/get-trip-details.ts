import { TripDetailsDto } from 'trip/dto/trip/trip-details.dto';
import { TripDocument } from 'trip/entities/trip.entity';

export const getTripDetails = (trip: TripDocument): TripDetailsDto => {
  // If no changes have been made to the user, updatedAt will be null so we use createdAt instead

  const updatedDate =
    trip.updatedAt?.toISOString() ?? trip.createdAt.toISOString();

  return {
    id: String(trip._id),
    name: trip.name,
    description: trip.description,
    thumbnail: trip.thumbnail,
    travelers: trip.travelers,
    days: trip.days.map((day) => ({
      id: String(day._id),
      name: day.name,
      date: day.date.toISOString(),
      description: day.description,
      createdAt: day.createdAt.toISOString(),
      updatedAt: day.updatedAt.toISOString(),
      events: day.events,
    })),

    categories: trip.categories,
    expenses: trip.expenses,
    createdAt: trip.createdAt.toISOString(),
    updatedAt: updatedDate,
  };
};
