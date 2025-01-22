import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
// Request Model
interface UpdateAccountRequest {
  name?: string;
  email?: string;
}

export const updateAccount = createAsyncThunk(
  "accounts/updateAccount",
  async (
    updatedAccount: { id: string; data: UpdateAccountRequest },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.put(
        `${process.env.REACT_APP_PUBLIC_API_URL}/accounts/${updatedAccount.id}`,
        updatedAccount.data
      );
      return response.data.success;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);
