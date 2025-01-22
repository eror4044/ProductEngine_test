import { createTestStore } from "../../testStore";
import { loginThunk } from "../authActions";

jest.mock("axios", () => ({
  post: jest.fn(() =>
    Promise.resolve({
      data: {
        user: { id: "1", username: "admin", email: "admin@example.com" },
        accessToken: "token123",
      },
    })
  ),
}));

describe("authActions", () => {
  it("should login and set user data", async () => {
    const store = createTestStore();

    await store.dispatch(
      loginThunk({ username: "admin", password: "admin123" }) as any
    );

    const state = store.getState();
    expect(state.auth.user).toEqual({
      id: "1",
      username: "admin",
      email: "admin@example.com",
    });
    expect(state.auth.isAuthenticated).toBe(true);
  });
});
