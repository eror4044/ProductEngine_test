import { createTestStore } from "../../testStore";
import { getModalState, openModal, closeModal } from "../accountSlice";

describe("accountSlice", () => {
  it("should handle openModal and closeModal actions", () => {
    const store = createTestStore();

    expect(getModalState(store.getState())).toBe(false);

    // Dispatch openModal
    store.dispatch(openModal());
    expect(getModalState(store.getState())).toBe(true);

    // Dispatch closeModal
    store.dispatch(closeModal());
    expect(getModalState(store.getState())).toBe(false);
  });
});
