import { Navigate, Outlet } from "react-router";
import { useAuthContext } from "../context/AuthContext";

export const RequireAuth = () => {
  const { auth } = useAuthContext();

  return auth ? <Outlet /> : <Navigate to="/login" replace />;
};
