import React from "react";
import { useAppSelector } from "../../store";
import { getUser } from "../../store/slices/authSlice";

const HomePage: React.FC = () => {
  const user = useAppSelector(getUser);

  return (
    <div className="home-page">
      <h1>Welcome to the Home Page</h1>
      <p>
        This is a placeholder text for the home page. It demonstrates how
        components and state management work together.
      </p>
      {user && (
        <p>
          Hello, <strong>{user.username}</strong>! It's great to have you here.
        </p>
      )}
    </div>
  );
};

export default HomePage;
