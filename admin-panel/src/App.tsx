import React from "react";
import {
  Routes,
  Route,
  Navigate,
  Outlet,
  BrowserRouter,
} from "react-router-dom";

import "./App.scss";
import Navbar from "./components/Navbar/Navbar";
import AccountPage from "./pages/AccountPage/AccountPage";
import ActivationPage from "./pages/ActivationPage/ActivationPage";
import HomePage from "./pages/HomePage/HomePage";
import LoginPage from "./pages/LoginPage/LoginPage";
import { useAppSelector } from "./store";
import { getIsAuthenticated } from "./store/slices/authSlice";

const ProtectedRoute: React.FC = () => {
  const isAuthenticated = useAppSelector(getIsAuthenticated);

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />;
  }

  return <Outlet />;
};

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <div className="app-container">
        <Navbar />
        <main>
          <Routes>
            <Route path="/auth/login" element={<LoginPage />} />

            <Route element={<ProtectedRoute />}>
              <Route path="/home" element={<HomePage />} />
              <Route path="/activation" element={<ActivationPage />} />
              <Route path="/account" element={<AccountPage />} />
            </Route>

            <Route path="*" element={<Navigate to="/auth/login" replace />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
};

export default App;
