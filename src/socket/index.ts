import { Socket, io } from "socket.io-client";
import { getData } from "../utils/storage";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const { VITE_BACKEND_URL, VITE_BACKEND_PORT } = import.meta.env;
// eslint-disable-next-line @typescript-eslint/restrict-template-expressions
export const ENDPOINT = `${VITE_BACKEND_URL}:${VITE_BACKEND_PORT}`;
export const connect = (path = "") => {
  const token = getData<string>("token");
  const socket = io(`${ENDPOINT}/${path}`, {
    extraHeaders: {
      authorization: token,
    },
  });
  return socket;
};

export type SocketNameSpace = "booking";
export type BookingEvent = "new-pending" | "new-accepted";
export type SocketEvent = `${SocketNameSpace}/${BookingEvent}`;
let booking: Socket | undefined;

export const createConnect = () => {
  booking = connect("booking");
};
export const disconnect = () => {
  if (!booking) return;
  booking.disconnect();
};

export const subcribe = (event: SocketEvent, cb: (...data: any[]) => void) => {
  if (!booking) return () => 0;
  const [namespace, eventName] = event.split("/") as [
    SocketNameSpace,
    BookingEvent,
  ];
  switch (namespace) {
    case "booking":
      booking.on(eventName, cb);
      return () => {
        booking?.off(eventName, cb);
      };
    default:
      return () => 0;
  }
};
