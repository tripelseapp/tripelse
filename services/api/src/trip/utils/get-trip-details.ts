import { TripDetailsDto } from 'trip/dto/trip/trip-details.dto';
import { TripDocument } from 'trip/entities/trip.entity';

export const getTripDetails = (trip: TripDocument): TripDetailsDto => {
  // If no changes have been made to the user, updatedAt will be null so we use createdAt instead

  const updatedDate = trip.updatedAt ?? trip.createdAt;

  return {
    id: String(trip._id),
    name: trip.name,
    description: trip.description,
    thumbnail: trip.thumbnail,
    travelers: trip.travelers.map((traveler: any) => ({
      id: traveler._id,
      username: traveler.name,
    })),
    days: trip.days.map((day: any) => ({
      id: String(day._id),
      name: day.name,
      date: day.date.toISOString(),
      description: day.description,
      createdAt: day.createdAt.toISOString(),
      updatedAt: day.updatedAt.toISOString(),
      events: day.events,
    })),

    categories: trip.categories,
    expenses: trip.expenses.map((expense: any) => ({
      id: String(expense._id),
      currency: expense.currency,
      attachments: expense.attachments,
      description: expense.description,
      categories: expense.categories,
      dateTime: expense.dateTime.toISOString(),
      createdAt: expense.createdAt.toISOString(),
      updatedAt: expense.updatedAt.toISOString(),
      contributors: expense.contributors.map((contributor: any) => ({
        id: contributor.id,
        amount: contributor.amount,
      })),
    })),
    createdAt: trip.createdAt,
    updatedAt: updatedDate,
  };
};
