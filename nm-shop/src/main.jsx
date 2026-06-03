import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css"; // 👈 Remplacé pour charger tes styles globaux et Tailwind
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);