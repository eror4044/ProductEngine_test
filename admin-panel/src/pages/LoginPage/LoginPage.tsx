import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import "./LoginPage.scss";
import { loginThunk } from "../../store/actions/authActions";
import { useAppDispatch, useAppSelector } from "../../store";
import { getError, getUser, logout } from "../../store/slices/authSlice";

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const error = useAppSelector(getError);
  const user = useAppSelector(getUser);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await dispatch(loginThunk({ username, password })).unwrap();
    } catch (error) {
      console.error("Login error:", error.message || error);
    }
  };
  useEffect(() => {
    dispatch(logout());
    user && navigate("/home");
  }, [user, error]);

  return (
    <div className="login-page">
      <div className="login-container">
        <h1>Login</h1>
        <form onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="login-input"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="login-input"
          />
          <button type="submit" className="login-button">
            Login
          </button>
        </form>
        {error && <p className="error-message">{error}</p>}
      </div>
    </div>
  );
};

export default LoginPage;
