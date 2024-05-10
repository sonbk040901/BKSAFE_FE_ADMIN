import { BookingStatus, Driver, SuggestDriver } from "./types";
import buildUrl from "../utils/searchParam";
import instance from "./axios";
import { Booking, PagingAndSortDto, PagingAndSortResponse } from "./types";
export interface GetAllPagingAndSortDto extends PagingAndSortDto {
  status?: string[];
}
export type BookingStatistic = {
  [key in BookingStatus]: number;
}
export const getAll = async (dto: Type<GetAllPagingAndSortDto> = {}) => {
  const path = `admin/bookings`;
  const url = buildUrl(path, dto);
  const res = await instance.get<PagingAndSortResponse<Booking>>(url);
  return res.data;
};
export const rejectBooking = async (bookingId: number) => {
  const path = `admin/bookings/${bookingId}/reject`;
  const res = await instance.patch<void>(path);
  return res.data;
};
export const getSuggestDrivers = async (bookingId: number) => {
  const path = `admin/bookings/${bookingId}/suggest/drivers`;
  const res = await instance.get<PagingAndSortResponse<SuggestDriver>>(path);
  return res.data;
};
export const suggestDriver = async (bookingId: number, driverId: number) => {
  const path = `admin/bookings/${bookingId}/suggest/${driverId}`;
  const res = await instance.post<void>(path);
  return res.data;
}
export const getStatistic = async () => {
  const path = `admin/bookings/statistic`;
  const res = await instance.get<BookingStatistic>(path);
  return res.data;
}