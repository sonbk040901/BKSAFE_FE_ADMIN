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

export interface PagingAndSortResponse<T> extends Required<PagingAndSortDto> {
  total: number;
  data: T[];
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
  activateStatus: ActivateStatus;
}
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface User extends Account {}
export interface License {
  id: number;
  createdAt: string;
  updatedAt: string;
  frontImage: string;
  backImage: string;
  number: string;
  fullName: string;
  address: string;
  birthday: string;
  issueDate: string;
  expireDate: string;
  classType: string;
}
export interface Cccd {
  id: number;
  createdAt: string;
  updatedAt: string;
  frontImage: string;
  backImage: string;
  number: string;
  fullName: string;
  address: string;
  birthday: string;
  issueDate: string;
  expireDate: string;
}
export type DriverStatus = "AVAILABLE" | "BUSY" | "OFFLINE";
export type ActivateStatus = "DEACTIVATED" | "ACTIVATED" | "BLOCKED";
export type RegisterStatus = "PENDING" | "ACCEPTED" | "REJECTED";
export interface Driver extends Account {
  phone: string;
  email: string;
  avatar: string;
  rating: number;
  birthday: string;
  address: string;
  location: Location;
  license: License;
  cccd: Cccd;
  registerStatus: RegisterStatus;
  status: DriverStatus;
}
export interface SuggestDriver extends Driver {
  priority: number;
  distance: number;
  matchCount: number;
  rejectCount: number;
  successCount: number;
  acceptCount: number;
}
// export interface User {}
export type BookingStatus =
  | "PENDING"
  | "ACCEPTED"
  | "RECEIVED"
  | "REJECTED"
  | "CANCELLED"
  | "DRIVING"
  | "COMPLETED"
  | "TIMEOUT";
export interface Booking {
  locations: Location[];
  notes: Note[];
  price: number;
  userId: number;
  user: User | null;
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
