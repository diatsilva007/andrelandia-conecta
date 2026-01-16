import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import AppWithRouter from "./App.jsx";
import { UserProvider } from "./contexts/UserContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <UserProvider>
      <AppWithRouter />
    </UserProvider>
  </StrictMode>
);
