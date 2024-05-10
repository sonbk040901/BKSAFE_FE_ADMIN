/* eslint-disable no-console */
import { Socket } from "socket.io-client";
import { connect as createConnect } from "./socket";
let socket: Socket;
export const connect = () => {
  socket = createConnect("booking");
  console.log(`Connected to booking socket`);
  return disconnect;
};
export const disconnect = () => {
  if (!socket) return;
  socket.disconnect();
  console.log(`Disconnected from booking socket`);
};
export const listenNewPendingBooking = (cb: (bookingId: number) => void) => {
  if (!socket) return;
  socket.on("new-pending", cb);
  return () => {
    socket.off("new-pending", cb);
  };
};
