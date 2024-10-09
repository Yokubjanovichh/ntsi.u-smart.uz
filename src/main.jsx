import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { SnackbarProvider } from "notistack";
import { Provider } from "react-redux";
import { store } from "./redux/store.js";

// import HomePage from "./pages/HomePage.jsx";
import "./index.css";
import "./fonts.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  // <React.StrictMode>
  <SnackbarProvider
    autoHideDuration={1500}
    anchorOrigin={{
      vertical: "top",
      horizontal: "center",
    }}
  >
    <Provider store={store}>
      <App />
    </Provider>
  </SnackbarProvider>
  // </React.StrictMode>
);
