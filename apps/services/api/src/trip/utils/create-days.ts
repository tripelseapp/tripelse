import { Types } from 'mongoose';
import { DayDocument } from 'trip/entities/day.entity';
import { CreateTripDto } from '../dto/trip/create-trip.dto';

const sampleDay = {
  description: '',
  createdAt: new Date(),
  updatedAt: new Date(),
  events: [],
};

export const getDays = (
  startDate: CreateTripDto['startDate'],
  endDate: CreateTripDto['endDate'],
) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const daysAmount = Math.floor(
    (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24),
  );

  if (daysAmount < 1) {
    throw new Error('The trip must last at least one day.');
  }

  const days: DayDocument[] = [];

  for (let i = 0; i <= daysAmount; i++) {
    const currentDate = new Date(start.getTime() + i * 24 * 60 * 60 * 1000);
    days.push({
      _id: new Types.ObjectId(),
      name: `Day ${i + 1}`,
      ...sampleDay,
      date: currentDate,
    } as unknown as DayDocument);
  }

  return days;
};
