import "@testing-library/jest-dom";

import { render, screen, fireEvent } from "@testing-library/react";
import { Provider } from "react-redux";
import { createTestStore } from "../../store/testStore";
import EditAccountModal from "./EditAccountModal";
import { openModal } from "../../store/slices/accountSlice";
import ReactModal from "react-modal";

describe("EditAccountModal", () => {
  it("validates empty fields and prevents save", async () => {
    const store = createTestStore();

    store.dispatch({
      type: "account/editingAccountSet",
      payload: { id: "1", name: "John Doe", email: "johndoe@example.com" },
    });
    store.dispatch(openModal());

    ReactModal.setAppElement(document.createElement("div"));

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
