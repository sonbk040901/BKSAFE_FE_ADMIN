export interface ErrorResponse {
  message: string | string[];
  error: string;
  statusCode: number;
}

export interface PagingAndSortDto {
  take?: number;
  skip?: number;
  order?: "asc" | "desc" | "ASC" | "DESC";
  sort?: string;
}
export interface Location {
  address: string;
  latitude: number;
  longitude: number;
  type: "PICKUP" | "DROP_OFF" | "STOP";
  bookingId: number;
  id: number;
}
export interface Note {
  id: number;
  createdAt: string;
  updatedAt: string;
  title: string;
  description: string;
}
type Gender = "OTHER" | "MALE" | "FEMALE";
export interface Account {
  id: number;
  createdAt: string;
  updatedAt: string;
  username: string;
  email: string;
  phone: string;
  fullName: string;
  avatar: string | null;
  gender: Gender;
  driver: Driver | null;
}
export interface Driver extends Account {
  name: string;
  phone: string;
  email: string;
  avatar: string;
  rating: number;
  birthday: string;
  address: string;
  location: Location;
}
// export interface User {}
export type BookingStatus =
  | "PENDING"
  | "ACCEPTED"
  | "REJECTED"
  | "CANCELLED"
  | "DRIVING"
  | "COMPLETED";
export interface Booking {
  locations: Location[];
  notes: Note[];
  price: number;
  userId: number;
  note: string;
  rating: number | null;
  startTime: string | null;
  endTime: string | null;
  nextLocationId: number | null;
  driverId: number | null;
  driver: Driver | null;
  id: number;
  createdAt: string;
  updatedAt: string;
  status: BookingStatus;
}
