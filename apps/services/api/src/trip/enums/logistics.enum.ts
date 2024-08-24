export enum LogisticsEnum {
  CAMPER = 'camper',
  CARAVAN = 'caravan',
  MOTORHOME = 'motorhome',
  PLANE_HOTEL = 'plane_hotel',
  PUBLIC_TRANSPORT_HOTEL = 'public_transport_hotel',
  BIKE = 'bike',
  MOTORBIKE_TENT = 'motorbike_tent',
  CRUISE = 'cruise',
}

export type Logistic = `${LogisticsEnum}`;

export const logistics = Object.values(LogisticsEnum);
