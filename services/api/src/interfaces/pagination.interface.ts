import { PageOptionsDto } from 'src/common/dto/pagination/page-options.dto';

export interface PageMetaDtoParameters {
  pageOptionsDto: PageOptionsDto;
  itemCount: number;
}
export enum Orders {
  ASC = 'ASC',
  DESC = 'DESC',
}
