import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { AppRouter } from "./router";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./providers/AuthProvider";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthProvider>
      <AppRouter />
      <Toaster position="bottom-right" />
    </AuthProvider>
  </StrictMode>
);
