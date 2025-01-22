import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { User } from "../../models/UserModel";

export const fetchUserById = createAsyncThunk(
  "account/fetchUserById",
  async (userId: string, { rejectWithValue }) => {
    try {
      const response = await axios.get<User[]>(
        `http://localhost:5000/users/${userId}`
      );
      return response.data;
    } catch (error) {
      return rejectWithValue("User not found");
    }
  }
);
