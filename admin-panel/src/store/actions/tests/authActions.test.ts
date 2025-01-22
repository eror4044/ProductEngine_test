import axios from "axios";
import { loginThunk } from "../../actions/authActions";
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../../slices/authSlice";
import { AnyAction } from "redux";
import { ThunkDispatch } from "@reduxjs/toolkit";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

const createTestStore = () => {
  return configureStore({
    reducer: {
      auth: authReducer,
    },
  });
};

describe("authActions", () => {
  let store: ReturnType<typeof createTestStore>;
  let dispatch: ThunkDispatch<unknown, unknown, AnyAction>;

  beforeEach(() => {
    store = createTestStore();
    dispatch = store.dispatch;
    Object.defineProperty(global, "localStorage", {
      value: {
        getItem: jest.fn(),
        setItem: jest.fn(),
        removeItem: jest.fn(),
        clear: jest.fn(),
      },
      writable: true,
    });
  });

  it("should login and set user data", async () => {
    mockedAxios.post.mockResolvedValueOnce({
      data: {
        user: { id: 1, username: "testUser" },
        accessToken: "mockAccessToken",
        refreshToken: "mockRefreshToken",
      },
    });

    await dispatch(loginThunk({ username: "testUser", password: "password" }));

    const state = store.getState();

    expect(state.auth.user).toEqual({ id: 1, username: "testUser" });
    expect(state.auth.isAuthenticated).toBe(true);

    expect(localStorage.setItem).toHaveBeenCalledWith(
      "accessToken",
      "mockAccessToken"
    );
    expect(localStorage.setItem).toHaveBeenCalledWith(
      "refreshToken",
      "mockRefreshToken"
    );
  });

  it("should handle login error", async () => {
    mockedAxios.post.mockRejectedValueOnce({
      response: {
        data: { message: "Invalid credentials" },
      },
    });

    await dispatch(loginThunk({ username: "testUser", password: "wrongPassword" }));

    const state = store.getState();

    expect(state.auth.user).toBeNull();
    expect(state.auth.isAuthenticated).toBe(false);

    expect(localStorage.setItem).not.toHaveBeenCalled();
  });
});
