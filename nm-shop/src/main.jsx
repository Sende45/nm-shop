import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./app.css"; // 👈 Remplace "./style-final.css" par "./app.css" (ou le nom exact du fichier qu'on a créé)
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);