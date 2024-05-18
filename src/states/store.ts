import { configureStore } from "@reduxjs/toolkit";
import account from "./slices/account";
import socket from "./slices/socket";
// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
const store = configureStore({
  reducer: { account, socket },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        // ignoredActions: ["your/action/type"],
        // Ignore these field paths in all actions
        // ignoredActionPaths: ["payload.cb"],
        // Ignore these paths in the state
        // ignoredPaths: ["items.dates"],
      },
    }),
});
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
