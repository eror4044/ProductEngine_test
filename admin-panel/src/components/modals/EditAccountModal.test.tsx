import { render, screen, fireEvent } from "@testing-library/react";
import { Provider } from "react-redux";
import { createTestStore } from "../../store/testStore";
import EditAccountModal from "./EditAccountModal";
import { openModal } from "../../store/slices/accountSlice";

describe("EditAccountModal", () => {
  it("renders modal with initial data", () => {
    const store = createTestStore();

    store.dispatch({
      type: "account/editingAccountSet",
      payload: { id: "1", name: "John Doe", email: "johndoe@example.com" },
    });
    store.dispatch(openModal());

    render(
      <Provider store={store}>
        <EditAccountModal />
      </Provider>
    );

    expect(screen.getByLabelText(/Name:/i)).toHaveValue("John Doe");
    expect(screen.getByLabelText(/Email:/i)).toHaveValue("johndoe@example.com");
  });

  it("validates empty fields and prevents save", async () => {
    const store = createTestStore();

    store.dispatch({
      type: "account/editingAccountSet",
      payload: { id: "1", name: "John Doe", email: "johndoe@example.com" },
    });
    store.dispatch(openModal());

    render(
      <Provider store={store}>
        <EditAccountModal />
      </Provider>
    );

    fireEvent.change(screen.getByLabelText(/Name:/i), {
      target: { value: "" },
    });
    fireEvent.change(screen.getByLabelText(/Email:/i), {
      target: { value: "" },
    });

    fireEvent.click(screen.getByText(/Save/i));

    expect(await screen.findByText(/Name is required/i)).toBeInTheDocument();
    expect(await screen.findByText(/Email is required/i)).toBeInTheDocument();
  });
});
