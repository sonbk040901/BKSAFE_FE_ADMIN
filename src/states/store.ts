import { configureStore } from "@reduxjs/toolkit";
import account from "./slices/account";
import socket from "./slices/socket";
// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
const store = configureStore({
  reducer: { account, socket },
});
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
