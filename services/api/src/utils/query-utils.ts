// utils/query-utils.ts
import { Model, Document, SortOrder, FilterQuery } from 'mongoose';
import { Orders, PossibleOrders } from 'interfaces/pagination.interface';

interface FiltersOptions {
  search?: string;
  startDate?: Date;
  endDate?: Date;
  [key: string]: any;
}
type ExtendedFilterQuery<T> = FilterQuery<T> & {
  createdAt?: { $gte?: Date; $lte?: Date };
};
export interface BuildQueryOptions<T> {
  model: Model<T>;
  filters: FiltersOptions;
  searchIn: (keyof T)[];
  fields?: (keyof T)[];
}

export function buildQuery<T extends Document>({
  model,
  filters,
  searchIn,
  fields = [],
}: BuildQueryOptions<T>): ExtendedFilterQuery<T> {
  let query: ExtendedFilterQuery<T> = model.find();

  if (Boolean(filters.search)) {
    const searchFields = searchIn || [];
    const searchString = String(filters.search ?? '');
    query = query.or(
      searchFields.map((field) => ({
        [field]: { $regex: new RegExp(searchString, 'i') },
      })),
    );
  }

  if (filters.startDate || filters.endDate) {
    query.createdAt = {};
    if (filters.startDate) {
      query.createdAt.$gte = new Date(filters.startDate);
    }
    if (filters.endDate) {
      query.createdAt.$lte = new Date(filters.endDate);
    }
  }

  // Add other dynamic filters based on filters
  Object.keys(filters).forEach((key) => {
    if (!['search', 'startDate', 'endDate'].includes(key)) {
      query[key as keyof T] = filters[key];
    }
  });

  query = query.select(fields.join(' '));

  return query;
}

export function buildSorting(orderBy: PossibleOrders | PossibleOrders[]) {
  return orderBy
    ? buildSortOptions(Array.isArray(orderBy) ? orderBy : [orderBy])
    : {};
}

export function buildSortOptions(orderBy: PossibleOrders[]): {
  [key: string]: SortOrder;
} {
  const sortOptions: { [key: string]: SortOrder } = {};
  orderBy.forEach((orderField) => {
    const [field, order] = orderField.split(':');
    sortOptions[field] = order === Orders.ASC ? 1 : -1;
  });

  return sortOptions;
}
export const buildQueryWithCount = <T extends Document>({
  model,
  filters,
  searchIn,
  fields = [],
}: BuildQueryOptions<T>) => {
  const query = buildQuery({ model, filters, searchIn, fields });
  // Apply the same filters to the count query
  const countQuery = buildQuery({ model, filters, searchIn, fields });

  return { query, countQuery };
};
