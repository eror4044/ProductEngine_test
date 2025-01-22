import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { updateAccount } from "../actions/updateAccount";
import { Account } from "../../models/AccountModel";
import { fetchAccountsById } from "../actions/fetchAccounts";
import { toast } from "react-toastify";

interface AccountState {
  isLoading: boolean;
  error: string | null;
  accounts: Account[];
  modalOpen: boolean;
  editingAccount: Account | null;
}

const initialState: AccountState = {
  isLoading: false,
  error: null,
  accounts: [],
  modalOpen: false,
  editingAccount: null,
};

const accountSlice = createSlice({
  name: "account",
  initialState,
  reducers: {
    clearAccountState: (state) => {
      state.accounts = null;
      state.error = null;
    },
    openModal: (state, action: PayloadAction<Account>) => {
      state.modalOpen = true;
      state.editingAccount = action.payload;
    },
    closeModal: (state) => {
      state.modalOpen = false;
      state.editingAccount = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAccountsById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAccountsById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.accounts = action.payload;
        state.error = null;
      })
      .addCase(fetchAccountsById.rejected, (state, action) => {
        state.isLoading = false;
        state.accounts = [];
        state.error = action.payload as string;
      })
      .addCase(updateAccount.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        updateAccount.fulfilled,
        (
          state,
          action: PayloadAction<{ message: string; success: boolean }>
        ) => {
          state.isLoading = false;
          action.payload
            ? toast.success("Account updated", {
                position: "bottom-right",
              })
            : toast.error(action.payload.message, { position: "bottom-right" });
          state.modalOpen = false;
        }
      )
      .addCase(updateAccount.rejected, (state, action: PayloadAction<any>) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const {
  clearAccountState,
  closeModal,
  openModal,
} = accountSlice.actions;

export const getAccounts = (state: { account: AccountState }) =>
  state.account.accounts;
export const getAccountError = (state: { account: AccountState }) =>
  state.account.error;
export const getAccountLoading = (state: { account: AccountState }) =>
  state.account.isLoading;
export const getModalState = (state: { account: AccountState }) =>
  state.account.modalOpen;
export const getEditingAccount = (state: { account: AccountState }) =>
  state.account.editingAccount;

export default accountSlice.reducer;
