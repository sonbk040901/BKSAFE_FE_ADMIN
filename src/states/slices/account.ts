import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { RootState } from "..";
import { authApi } from "../../api";
import { Account } from "../../api/types";

interface AuthState {
  // status: "loading" | "success" | "error";
  // updateStatus: "idle" | "loading" | "success" | "error";
  info?: Account; // for user object
  // error: null | object;
}
// const initialState: AuthState = {
//   status: "loading",
//   updateStatus: "idle",
//   info: null, // for user object
//   error: null,
// };
const initialState: AuthState = {};
export const accountSlice = createSlice({
  name: "account",
  initialState,
  reducers: {
    patchAccount: (state, action: PayloadAction<Account | undefined>) => {
      if (!action.payload) authApi.logout();
      state.info = action.payload;
    },
    removeAccount: (state) => {
      authApi.logout();
      state.info = undefined;
    },
  },
});
export const selectAccount = (state: RootState) => state.account;
export const { patchAccount, removeAccount } = accountSlice.actions;
export default accountSlice.reducer;
