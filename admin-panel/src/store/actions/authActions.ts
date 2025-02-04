import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { LoginRequest, LoginResponse } from "../../models/Auth";

export const loginThunk = createAsyncThunk(
  "auth/login",
  async (credentials: LoginRequest, { rejectWithValue }) => {
    try {
      console.log("PUBLIC_API_URL:", process.env.REACT_APP_PUBLIC_API_URL);

      const response = await axios.post<LoginResponse>(
        `${process.env.REACT_APP_PUBLIC_API_URL}/auth/login`,
        credentials
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || error.message);
    }
  }
);
