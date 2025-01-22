import { NavLink } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../../store";
import { getIsAuthenticated, logout } from "../../store/slices/authSlice";
import "./Navbar.scss";

const Navbar: React.FC = () => {
  const isAuthenticated = useAppSelector(getIsAuthenticated);
  const dispatch = useAppDispatch();

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {isAuthenticated && (
          <>
            <div className="nav-wrapper">
              <NavLink
                to="/home"
                className={({ isActive }) =>
                  isActive ? "navbar-link active" : "navbar-link"
                }
              >
                Home
              </NavLink>
              <NavLink
                to="/activation"
                className={({ isActive }) =>
                  isActive ? "navbar-link active" : "navbar-link"
                }
              >
                Activation
              </NavLink>
              <NavLink
                to="/account"
                className={({ isActive }) =>
                  isActive ? "navbar-link active" : "navbar-link"
                }
              >
                Account
              </NavLink>
            </div>

            <button className="logout-button" onClick={handleLogout}>
              Logout
            </button>
          </>
        )}
        {!isAuthenticated && <p>Login page</p>}
      </div>
    </nav>
  );
};

export default Navbar;
