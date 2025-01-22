import { createSlice } from "@reduxjs/toolkit";
import { loginThunk } from "../actions/authActions";
import { RootState } from "..";
import { toast } from "react-toastify";

const initialState: AuthState = {
  user: null,
  accessToken: null,
  refreshToken: null,
  isLoading: false,
  error: null,
  isAuthenticated: false,
};

interface AuthState {
  user: {
    id: string;
    username: string;
    email: string;
  } | null;
  accessToken: string | null;
  refreshToken: string | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      state.error = null;
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
    },
    initializeAuth: (state) => {
      const accessToken = localStorage.getItem("accessToken");
      const refreshToken = localStorage.getItem("refreshToken");
      if (accessToken && refreshToken) {
        state.accessToken = accessToken;
        state.refreshToken = refreshToken;
        state.isAuthenticated = true;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        localStorage.setItem("accessToken", action.payload.accessToken);
        localStorage.setItem("refreshToken", action.payload.refreshToken);
        state.isAuthenticated = true;
        state.error = null;
        toast.success("Login successful!", { position: "bottom-right" });
      })
      .addCase(loginThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        toast.error(`Error: ${action.payload}`, { position: "bottom-left" });
      });
  },
});

export const getIsAuthenticated = (state: RootState) =>
  state.auth.isAuthenticated;
export const getUser = (state: RootState) => state.auth.user;
export const getError = (state: RootState) => state.auth.error;

export const { logout, initializeAuth } = authSlice.actions;

export default authSlice.reducer;
