import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import { AuthProvider } from "./hooks/useAuth.jsx";
import { ToastProvider } from "./hooks/useToast.jsx";
import "./styles/index.css";

// Public pages are prerendered to static HTML for crawlers; the client renders fresh on load.
const root = document.getElementById("root");
root.innerHTML = "";
createRoot(root).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <App />
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);
