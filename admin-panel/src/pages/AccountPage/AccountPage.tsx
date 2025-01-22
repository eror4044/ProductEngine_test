import { useState, useEffect } from "react";
import "./AccountPage.scss";
import { useAppDispatch, useAppSelector } from "../../store";
import { getUser } from "../../store/slices/authSlice";
import { fetchUserById } from "../../store/actions/fetchUserById";
import {
  getAccountError,
  getAccountLoading,
  getAccountUsers,
} from "../../store/slices/accountSlice";

const AccountPage = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector(getUser);
  const accounts = useAppSelector(getAccountUsers);
  const isLoading = useAppSelector(getAccountLoading);
  const error = useAppSelector(getAccountError);

  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  useEffect(() => {
    dispatch(fetchUserById(searchQuery));
  }, [searchQuery, dispatch]);

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="account-page">
      <h1>Account Page</h1>
      {user && <p>Logged in as: {user.username}</p>}
      <div className="search-box">
        <input
          type="text"
          placeholder="Search accounts by ID, name, or email"
          value={searchQuery}
          onChange={handleSearch}
        />
      </div>
      {error && <p className="error">{error}</p>}
      <div className="account-list">
        {accounts.length > 0 ? (
          accounts.map((account) => (
            <div key={account.id} className="account-item">
              <p>
                <strong>ID:</strong> {account.id}
              </p>
              <p>
                <strong>Name:</strong> {account.name}
              </p>
              <p>
                <strong>Email:</strong> {account.email}
              </p>
            </div>
          ))
        ) : (
          <p>No accounts found.</p>
        )}
      </div>
    </div>
  );
};

export default AccountPage;
