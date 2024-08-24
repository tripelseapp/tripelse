import { PageOptionsDto } from 'common/resources/pagination';

export interface PageMetaDtoParameters {
  pageOptionsDto: PageOptionsDto;
  itemCount: number;
}
export enum Orders {
  ASC = 'ASC',
  DESC = 'DESC',
}
export type Order = `${Orders}`;

export type PossibleOrders = `${string}:${Orders}`;
