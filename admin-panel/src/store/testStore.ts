import { configureStore } from "@reduxjs/toolkit";
import accountReducer from "./slices/accountSlice";
import authReducer from "./slices/authSlice";

export const createTestStore = () =>
  configureStore({
    reducer: {
      account: accountReducer,
      auth: authReducer,
    },
  });

export type TestStore = ReturnType<typeof createTestStore>;
export type TestState = ReturnType<TestStore["getState"]>;
export type TestDispatch = TestStore["dispatch"];
