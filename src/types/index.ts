interface LatLng {
  lat: number;
  lng: number;
}

interface Location {
  address: string;
  latLng: LatLng;
}

interface User {
  username: string;
  fullname: string;
  email: string;
  phone: string;
  avatar?: string;
}

interface Driver extends User {
  birthday: string;
  starAvg: number;
}

export type { LatLng, Location, User, Driver };
