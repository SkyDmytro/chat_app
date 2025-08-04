import { Navigate, Outlet } from "react-router";
import { useAuthContext } from "../context/AuthContext";

export const RequireNoAuth = () => {
  const { auth } = useAuthContext();

  return !auth ? <Outlet /> : <Navigate to="/chats" replace />;
};
