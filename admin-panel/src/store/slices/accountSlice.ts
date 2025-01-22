import { createSlice } from "@reduxjs/toolkit";
import { User } from "../../models/UserModel";
import { fetchUserById } from "../actions/fetchUserById";

interface AccountState {
  users: User[] | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: AccountState = {
  users: [],
  isLoading: false,
  error: null,
};

const accountSlice = createSlice({
  name: "account",
  initialState,
  reducers: {
    clearAccountState: (state) => {
      state.users = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUserById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.users = action.payload;
        state.error = null;
      })
      .addCase(fetchUserById.rejected, (state, action) => {
        state.isLoading = false;
        state.users = [];
        state.error = action.payload as string;
      });
  },
});

export const { clearAccountState } = accountSlice.actions;

export const getAccountUsers = (state: { account: AccountState }) =>
  state.account.users;
export const getAccountError = (state: { account: AccountState }) =>
  state.account.error;
export const getAccountLoading = (state: { account: AccountState }) =>
  state.account.isLoading;

export default accountSlice.reducer;
