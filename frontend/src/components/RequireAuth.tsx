import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAutoLogout } from "@/hooks/useAutoLogout"; // ✅ import the hook

export function RequireAuth({ children }: { children: React.ReactNode }) {
  const username = localStorage.getItem("username");
  const location = useLocation();

  useAutoLogout(); // ✅ start monitoring for inactivity

  if (!username) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}
