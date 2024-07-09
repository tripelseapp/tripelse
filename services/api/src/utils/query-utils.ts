// utils/query-utils.ts
import { Model, Document, SortOrder, FilterQuery } from 'mongoose';
import { Orders, PossibleOrders } from 'src/interfaces/pagination.interface';

interface FiltersOptions {
  search?: string;
  startDate?: Date;
  endDate?: Date;
  [key: string]: any;
}
type ExtendedFilterQuery<T> = FilterQuery<T> & {
  createdAt?: { $gte?: Date; $lte?: Date };
};

export function buildQuery<T extends Document>(
  model: Model<T>,
  filters: FiltersOptions,
  selectFields: (keyof T)[],
): ExtendedFilterQuery<T> {
  let query: ExtendedFilterQuery<T> = model.find();

  // Apply filters
  if (filters.search) {
    query = query.or([
      { username: { $regex: new RegExp(filters.search, 'i') } },
      { email: { $regex: new RegExp(filters.search, 'i') } },
    ]);
  }

  // if (filters.search) {
  //   query.$or = selectFields.map((field) => ({
  //     [field]: { $regex: filters.search, $options: 'i' },
  //   })) as any; // Type assertion to avoid type conflict
  // }

  // if (filters.startDate || filters.endDate) {
  //   query.createdAt = {};
  //   if (filters.startDate) {
  //     query.createdAt.$gte = new Date(filters.startDate);
  //   }
  //   if (filters.endDate) {
  //     query.createdAt.$lte = new Date(filters.endDate);
  //   }
  // }

  // // Add other dynamic filters based on filters
  // Object.keys(filters).forEach((key) => {
  //   if (!['search', 'startDate', 'endDate'].includes(key)) {
  //     query[key as keyof T] = filters[key];
  //   }
  // });

  query = query.select(selectFields.join(' '));

  return query;
}

export function buildSortOptions(orderBy: PossibleOrders[]): {
  [key: string]: SortOrder;
} {
  const sortOptions = {};
  orderBy.forEach((orderField) => {
    const [field, order] = orderField.split(':');
    sortOptions[field] = order === Orders.ASC ? 1 : -1;
  });

  return sortOptions;
}
