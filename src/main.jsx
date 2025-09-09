import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.jsx";
import { CartProvider } from "./context/CartContext.jsx";
import { CategoriesProvider } from "./context/CategoriesContext";
import { NotificationProvider } from "./context/NotificationsContext.jsx";
import { ContactProvider } from "./context/ContactContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <CategoriesProvider>
            <NotificationProvider>
              <ContactProvider>
                <App />
              </ContactProvider>
            </NotificationProvider>
          </CategoriesProvider>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);
