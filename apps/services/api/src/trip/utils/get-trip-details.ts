import { TripDetailsDto } from 'trip/dto/trip/trip-details.dto';
import { TripDocument } from 'trip/entities/trip.entity';
import { UserDocument } from 'user/entities/user.entity';
import { getUserInList, getUsersInList } from 'user/utils/get-users-list';
export interface TripDetailMetadata {
  active: boolean;
  areYouMember: boolean;
}
export const getTripDetails = (
  trip: TripDocument,
  metadata: TripDetailMetadata,
): TripDetailsDto => {
  // If no changes have been made to the user, updatedAt will be null so we use createdAt instead

  const createdBy = trip.createdBy as unknown as UserDocument;
  const updatedDate = trip.updatedAt ?? trip.createdAt;
  return {
    id: String(trip._id),
    name: trip.name,
    public: false,
    active: metadata.active,
    areYouMember: metadata.areYouMember,
    description: trip.description,
    thumbnail: trip.thumbnail,
    createdBy: getUserInList(createdBy),
    travelers: getUsersInList(trip.travelers as unknown as UserDocument[]),

    days: trip.days.map((day: any) => ({
      id: String(day._id),
      name: day.name,
      date: day.date.toISOString(),
      description: day.description,
      createdAt: day.createdAt.toISOString(),
      updatedAt: day.updatedAt.toISOString(),
      events: day.events,
    })),

    moods: trip.moods,
    purposes: trip.purposes,
    duration: trip.duration,
    budget: trip.budget,
    logistics: trip.logistics,
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
