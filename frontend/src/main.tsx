import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter, Navigate, Route, Routes } from "react-router";
import { LoginPage } from "./pages/LoginPage.tsx";
import RegisterPage from "./pages/RegisterPage.tsx";
import { AuthProvider } from "./features/auth/context/AuthContext.tsx";
import { ChatsPage } from "./pages/ChatsPage.tsx";
import { RequireNoAuth } from "./features/auth/guards/RequireNoAuth.tsx";
import { RequireAuth } from "./features/auth/guards/RequireAuth.tsx";
import { UsersPage } from "./pages/UsersPage.tsx";
import { SocketProvider } from "./socket/context/SocketContext.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route element={<RequireNoAuth />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
          </Route>

          <Route element={<RequireAuth />}>
            <Route
              path="/chats"
              element={
                <SocketProvider>
                  <ChatsPage />
                </SocketProvider>
              }
            />
            <Route path="/users" element={<UsersPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  </StrictMode>
);
