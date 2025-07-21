import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { store } from "./stores/store";
import { Provider } from "react-redux";
import "./index.css";

const rootElement = document.getElementById("root");
if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <Provider store={store}>
        <App />
      </Provider>
    </React.StrictMode>
  );
} else {
  throw new Error("Root element not found");
}
