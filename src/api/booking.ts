import instance from "./axios";
import { Booking } from "./types";
export const getBooking = async (id: number) => {
  const path = `driver/bookings/${id}`;
  const res = await instance.get<Booking>(path);
  return res.data;
};
