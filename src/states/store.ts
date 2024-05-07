import { configureStore } from "@reduxjs/toolkit";
import account from "./slices/account";
// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
const store = configureStore({
  reducer: { account },
});
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
