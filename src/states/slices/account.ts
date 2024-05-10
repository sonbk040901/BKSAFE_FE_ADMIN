import { PayloadAction, createSelector, createSlice } from "@reduxjs/toolkit";
import { RootState } from "..";
import { authApi } from "../../api";
import { Account } from "../../api/types";

interface AuthState {
  info?: Account;
}
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
export const selectAccountInfo = createSelector(
  selectAccount,
  (account) => account.info,
);
export const { patchAccount, removeAccount } = accountSlice.actions;
export default accountSlice.reducer;
