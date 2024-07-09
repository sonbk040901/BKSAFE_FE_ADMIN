import { Socket, io } from "socket.io-client";
import { getData } from "../utils/storage";
const { VITE_BACKEND_URL, VITE_BACKEND_PORT } = import.meta.env as Record<
  string,
  string
>;

export const ENDPOINT = VITE_BACKEND_PORT
  ? `${VITE_BACKEND_URL}:${VITE_BACKEND_PORT}`
  : VITE_BACKEND_URL;
export const connect = (path = "") => {
  const token = getData<string>("token");
  console.log("Connect to socket", `${ENDPOINT}/${path}`);
  // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
  const socket = io(`${ENDPOINT}/${path}`, {
    extraHeaders: {
      authorization: token,
    },
  });
  return socket;
};

export type SocketNameSpace = "booking";
export type BookingEvent =
  | "new-pending"
  | "new-accepted"
  | "current-driver-location"
  | "current-status"
export type SocketEvent = `${SocketNameSpace}/${BookingEvent}`;
let booking: Socket | undefined;

export const createConnect = () => {
  booking = connect("booking");
};
export const disconnect = () => {
  if (!booking) return;
  booking.disconnect();
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const subcribe = (event: SocketEvent, cb: (...data: any[]) => void) => {
  if (!booking) return () => 0;
  const [namespace, eventName] = event.split("/") as [
    SocketNameSpace,
    BookingEvent,
  ];
  console.log(
    "%cSubcribe: ",
    "font-weight: 500; font-size: 11px;color: red; text-shadow: 1px 1px 0 rgb(255, 219, 151) , 1.1px 1.1px 0 rgb(255, 94, 0) , 1.2px 1.2px 0 rgb(245,221,8) , 1.3px 1.3px 0 rgb(5,148,68) , 1.4px 1.4px 0 rgb(2,135,206) , 1.5px 1.5px 0 rgb(4,77,145) , 1.6px 1.6px 0 rgb(42,21,113)",
    event,
  );
  let unsubcribe: () => void;
  switch (namespace) {
    case "booking":
      booking.on(eventName, cb);
      unsubcribe = () => booking?.off(eventName, cb);
      break;
    default:
      unsubcribe = () => 0;
      break;
  }
  return () => {
    unsubcribe();
    console.log(
      "%cUnsubcribe: ",
      "font-weight: 500; font-size: 11px;color: red; text-shadow: 1px 1px 0 rgb(255, 219, 151) , 1.1px 1.1px 0 rgb(255, 211, 186) , 1.2px 1.2px 0 rgb(245,221,8) , 1.3px 1.3px 0 rgb(5,148,68) , 1.4px 1.4px 0 rgb(2,135,206) , 1.5px 1.5px 0 rgb(4,77,145) , 1.6px 1.6px 0 rgb(42,21,113)",
      event,
    );
  };
};
