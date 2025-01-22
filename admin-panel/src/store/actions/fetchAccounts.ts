import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { Account } from "../../models/AccountModel";

export const fetchAccountsById = createAsyncThunk(
  "account/fetchAccountsById",
  async (userId: string, { rejectWithValue }) => {
    try {
      const response = await axios.get<Account[]>(
        `${process.env.REACT_APP_PUBLIC_API_URL}/accounts/${userId}`
      );
      return response.data;
    } catch (error) {
      return rejectWithValue("User not found");
    }
  }
);
