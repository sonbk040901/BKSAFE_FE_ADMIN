import { io } from "socket.io-client";
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
