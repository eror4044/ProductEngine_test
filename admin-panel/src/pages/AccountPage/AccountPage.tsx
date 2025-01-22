import { useState, useEffect } from "react";
import "./AccountPage.scss";
import { useAppDispatch, useAppSelector } from "../../store";
import { getUser } from "../../store/slices/authSlice";
import {
  getAccountError,
  getAccountLoading,
  getAccounts,
  openModal,
} from "../../store/slices/accountSlice";
import { Blocks } from "react-loader-spinner";
import { fetchAccountsById } from "../../store/actions/fetchAccounts";
import EditAccountModal from "../../components/modals/EditAccountModal";

const AccountPage = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector(getUser);
  const accounts = useAppSelector(getAccounts);
  const isLoading = useAppSelector(getAccountLoading);
  const error = useAppSelector(getAccountError);

  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setSearchQuery(e.target.value);
  };

  const handleEditClick = (account) => {
    dispatch(openModal(account));
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery]);

  useEffect(() => {
    if (debouncedQuery) {
      dispatch(fetchAccountsById(debouncedQuery));
    }
  }, [debouncedQuery, dispatch]);

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
      {isLoading ? (
        <Blocks
          height="80"
          width="80"
          color="#4fa94d"
          ariaLabel="blocks-loading"
          wrapperStyle={{}}
          wrapperClass="blocks-wrapper"
          visible={true}
        />
      ) : (
        <div className="account-list">
          {accounts.length > 0 &&
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
                <button onClick={() => handleEditClick(account)}>Edit</button>
              </div>
            ))}
        </div>
      )}
      <EditAccountModal />
    </div>
  );
};

export default AccountPage;
