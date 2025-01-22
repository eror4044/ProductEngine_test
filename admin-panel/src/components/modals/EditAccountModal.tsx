import React from "react";
import ReactModal from "react-modal";
import * as Yup from "yup";
import { useAppDispatch, useAppSelector } from "../../store";
import {
  closeModal,
  getModalState,
  getEditingAccount,
  getAccountLoading,
} from "../../store/slices/accountSlice";
import { updateAccount } from "../../store/actions/updateAccount";
import "./EditAccountModal.scss";

const validationSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, "Name must be at least 2 characters")
    .required("Name is required"),
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
});

const EditAccountModal: React.FC = () => {
  const dispatch = useAppDispatch();
  const isModalOpen = useAppSelector(getModalState);
  const editingAccount = useAppSelector(getEditingAccount);
  const accountLoading = useAppSelector(getAccountLoading);

  const [updatedData, setUpdatedData] = React.useState({
    name: editingAccount?.name || "",
    email: editingAccount?.email || "",
  });

  const [errors, setErrors] = React.useState<{ [key: string]: string }>({});

  React.useEffect(() => {
    if (editingAccount) {
      setUpdatedData({
        name: editingAccount.name,
        email: editingAccount.email,
      });
    }
  }, [editingAccount]);

  const handleCloseModal = () => {
    dispatch(closeModal());
    setUpdatedData({ name: "", email: "" });
    setErrors({});
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUpdatedData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSave = async () => {
    try {
      await validationSchema.validate(updatedData, { abortEarly: false });
      await dispatch(
        updateAccount({ id: editingAccount?.id || "", data: updatedData })
      ).unwrap();
      handleCloseModal();
    } catch (validationErrors) {
      const formErrors: { [key: string]: string } = {};
      validationErrors.inner.forEach((err: any) => {
        formErrors[err.path] = err.message;
      });
      setErrors(formErrors);
    }
  };

  return (
    <ReactModal
      isOpen={isModalOpen}
      onRequestClose={handleCloseModal}
      className="modal"
      overlayClassName="modal-overlay"
    >
      <div className="modal-content">
        <h2>Edit Account</h2>
        <div className="form-group">
          <label htmlFor="name">Name:</label>
          <input
            id="name"
            name="name"
            value={updatedData.name}
            onChange={handleInputChange}
          />
          {errors.name && <p className="error-message">{errors.name}</p>}
        </div>
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            id="email"
            name="email"
            value={updatedData.email}
            onChange={handleInputChange}
          />
          {errors.email && <p className="error-message">{errors.email}</p>}
        </div>
        <div className="modal-actions">
          <button onClick={handleCloseModal} disabled={accountLoading}>
            Cancel
          </button>
          <button onClick={handleSave} disabled={accountLoading}>
            Save
          </button>
        </div>
      </div>
    </ReactModal>
  );
};

export default EditAccountModal;
