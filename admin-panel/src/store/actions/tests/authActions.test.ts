import axios from "axios";
import { loginThunk } from "../../actions/authActions";
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../../slices/authSlice";
import { ThunkDispatch } from "@reduxjs/toolkit";
import { AnyAction } from "redux";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

const createTestStore = () =>
  configureStore({
    reducer: { auth: authReducer },
  });

describe("authActions", () => {
  let store: ReturnType<typeof createTestStore>;
  let dispatch: ThunkDispatch<unknown, unknown, AnyAction>;

  beforeEach(() => {
    store = createTestStore();
    dispatch = store.dispatch;
  });

  it("should login and set user data", async () => {
    mockedAxios.post.mockResolvedValue({
      data: {
        user: { id: 1, username: "testUser" },
        accessToken: "mockAccessToken",
        refreshToken: "mockRefreshToken",
      },
    });

    await dispatch(loginThunk({ username: "testUser", password: "password" }));

    const state = store.getState();

    expect(state.auth.user).toEqual({ id: 1, username: "testUser" });
    expect(localStorage.setItem).toHaveBeenCalledWith(
      "accessToken",
      "mockAccessToken"
    );
    expect(localStorage.setItem).toHaveBeenCalledWith(
      "refreshToken",
      "mockRefreshToken"
    );
  });
});
