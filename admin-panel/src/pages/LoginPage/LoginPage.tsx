import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import "./LoginPage.scss";
import { loginThunk } from "../../store/actions/authActions";
import { useAppDispatch, useAppSelector } from "../../store";
import { getError, getIsAuthenticated, logout } from "../../store/slices/authSlice";

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const error = useAppSelector(getError);
  const isAuthenticated = useAppSelector(getIsAuthenticated);
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
  }, [dispatch]);

  useEffect(() => {
    isAuthenticated && navigate("/home");
  }, [isAuthenticated, error, dispatch, navigate]);

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
