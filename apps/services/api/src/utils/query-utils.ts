// utils/query-utils.ts
import { Model, Document, SortOrder, FilterQuery } from 'mongoose';
import { Orders, PossibleOrders } from 'interfaces/pagination.interface';

export interface BuildQueryOptions<T> {
  model: Model<T>;
  filters: Record<string, any>; // Use Record<string, any> for dynamic filters
  searchIn: (keyof T)[];
  fields?: (keyof T | string)[];
}

//

function buildFilterConditions<T extends Document>(
  filters: Record<string, any>,
  searchIn: (keyof T)[],
): Record<string, any> {
  const conditions: Record<string, any> = {};

  if (filters.search) {
    const searchFields = searchIn || [];
    const searchString = String(filters.search);
    conditions.$or = searchFields.map((field) => ({
      [field]: { $regex: new RegExp(searchString, 'i') },
    }));
  }

  if (filters.startDate || filters.endDate) {
    conditions.createdAt = {};
    if (filters.startDate) {
      conditions.createdAt.$gte = new Date(filters.startDate);
    }
    if (filters.endDate) {
      conditions.createdAt.$lte = new Date(filters.endDate);
    }
  }

  Object.keys(filters).forEach((key) => {
    if (!['search', 'startDate', 'endDate'].includes(key)) {
      if (!filters[key]) {
        return;
      }
      if (Array.isArray(filters[key]) && filters[key].length > 0) {
        if (key === 'budget') {
          conditions[key] = { $in: filters[key] };
        }

        conditions[key] = { $in: filters[key] };
      } else {
        conditions[key] = filters[key];
      }
    }
  });

  return conditions;
}
export function buildQuery<T extends Document>({
  model,
  filters,
  searchIn,
  fields = [],
}: BuildQueryOptions<T>): FilterQuery<T> {
  const conditions = buildFilterConditions(filters, searchIn);

  let query = model.find(conditions as FilterQuery<T>) as ReturnType<
    typeof model.find
  >;

  if (fields.length > 0) {
    const allFields = fields.join(' ');
    query = query.select(allFields) as ReturnType<typeof model.find>;
  }

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
