import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import store from "./store";
import App from "./App";
import "./index.scss";
import "./utils/axiosInterceptor";
import { initializeAuth } from "./store/slices/authSlice";
import { StrictMode } from "react";

store.dispatch(initializeAuth());

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <StrictMode>
    <Provider
      store={store}
      children={
        <App />
      }
    />
  </StrictMode>
);
