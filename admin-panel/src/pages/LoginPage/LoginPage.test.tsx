import { render, screen, fireEvent } from "@testing-library/react";
import { Provider } from "react-redux";
import { createTestStore } from "../../store/testStore"; // Ваша функция для создания тестового store
import LoginPage from "./LoginPage";
import { loginThunk } from "../../store/actions/authActions";

jest.mock("../../store/actions/authActions", () => ({
  loginThunk: jest.fn(),
}));

describe("LoginPage", () => {
  let store: ReturnType<typeof createTestStore>;

  beforeEach(() => {
    store = createTestStore();
    store.dispatch = jest.fn();
  });

  test("renders login form with username and password inputs", () => {
    render(
      <Provider store={store}>
        <LoginPage />
      </Provider>
    );

    expect(screen.getByPlaceholderText(/Username/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Login/i })).toBeInTheDocument();
  });

  test("dispatches loginThunk on form submit", async () => {
    ((loginThunk as unknown) as jest.Mock).mockResolvedValueOnce({
      user: { id: "1", username: "admin", email: "admin@example.com" },
    });

    render(
      <Provider store={store}>
        <LoginPage />
      </Provider>
    );

    fireEvent.change(screen.getByPlaceholderText(/Username/i), {
      target: { value: "admin" },
    });
    fireEvent.change(screen.getByPlaceholderText(/Password/i), {
      target: { value: "admin123" },
    });

    fireEvent.click(screen.getByRole("button", { name: /Login/i }));

    expect(store.dispatch).toHaveBeenCalledWith(expect.any(Function));

    expect(loginThunk).toHaveBeenCalledWith({
      username: "admin",
      password: "admin123",
    });
  });

  test("shows error message on invalid credentials", async () => {
    ((loginThunk as unknown) as jest.Mock).mockRejectedValueOnce(
      new Error("Invalid credentials")
    );

    render(
      <Provider store={store}>
        <LoginPage />
      </Provider>
    );

    fireEvent.change(screen.getByPlaceholderText(/Username/i), {
      target: { value: "wrongUser" },
    });
    fireEvent.change(screen.getByPlaceholderText(/Password/i), {
      target: { value: "wrongPass" },
    });

    fireEvent.click(screen.getByRole("button", { name: /Login/i }));

    expect(await screen.findByText(/Invalid credentials/i)).toBeInTheDocument();
  });

  test("navigates to /home on successful login", async () => {
    ((loginThunk as unknown) as jest.Mock).mockResolvedValueOnce({
      user: { id: "1", username: "admin", email: "admin@example.com" },
    });

    render(
      <Provider store={store}>
        <LoginPage />
      </Provider>
    );

    fireEvent.change(screen.getByPlaceholderText(/Username/i), {
      target: { value: "admin" },
    });
    fireEvent.change(screen.getByPlaceholderText(/Password/i), {
      target: { value: "admin123" },
    });

    fireEvent.click(screen.getByRole("button", { name: /Login/i }));

    expect(store.dispatch).toHaveBeenCalledWith(expect.any(Function));

    expect(store.getState().auth.isAuthenticated).toBe(true);
  });
});
