import buildUrl from "../utils/searchParam";
import instance from "./axios";
import {
  Booking,
  BookingStatus,
  PagingAndSortDto,
  PagingAndSortResponse,
  SuggestDriver,
} from "./types";
export interface GetAllPagingAndSortDto extends PagingAndSortDto {
  status?: string[];
}
export type BookingStatistic = {
  [key in BookingStatus]?: number;
};

export const getAll = async (dto: Type<GetAllPagingAndSortDto> = {}) => {
  const path = `bookings`;
  const url = buildUrl(path, dto);
  const res = await instance.get<PagingAndSortResponse<Booking>>(url);
  return res.data;
};
export const rejectBooking = async (bookingId: number) => {
  const path = `bookings/${bookingId}/reject`;
  const res = await instance.patch<void>(path);
  return res.data;
};
export const getSuggestDrivers = async (bookingId: number) => {
  const path = `bookings/${bookingId}/suggest/drivers`;
  const res = await instance.get<PagingAndSortResponse<SuggestDriver>>(path);
  return res.data;
};
export const suggestDriver = async (bookingId: number, driverId: number) => {
  const path = `bookings/${bookingId}/suggest/${driverId}`;
  const res = await instance.post<void>(path);
  return res.data;
};
export const stopFindDriver = async (bookingId: number) => {
  const path = `bookings/${bookingId}/timeout`;
  const res = await instance.patch<void>(path);
  return res.data;
}
export const getStatistic = async () => {
  const path = `bookings/statistic`;
  const res = await instance.get<BookingStatistic>(path);
  return res.data;
};

export const getFindDriverMode = async () => {
  const path = "bookings/mode";
  const res = await instance.get<boolean>(path);
  return res.data;
};

export const changeFindDriverMode = async (auto?: boolean) => {
  const path = "bookings/mode";
  const res = await instance.patch<boolean>(path, { auto });
  return res.data;
};
