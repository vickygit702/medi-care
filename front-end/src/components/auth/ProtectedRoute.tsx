// components/auth/ProtectedRoute.tsx
import { useSelector } from "react-redux";
import type { RootState } from "../../stores/store";
import { Navigate } from "react-router-dom";
import type { JSX } from "react";

export default function ProtectedRoute({
  children,
  role,
}: {
  children: JSX.Element;
  role?: "patient" | "caretaker";
}) {
  const { user } = useSelector((state: RootState) => state.auth);

  if (!user) return <Navigate to="/login" />;
  if (role && user.role !== role) return <Navigate to="/unauthorized" />;

  return children;
}
