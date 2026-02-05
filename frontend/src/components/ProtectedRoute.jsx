import React from "react";
import { Navigate } from "react-router-dom";
import { useUser } from "../contexts/UserContext.jsx";
import LoadingBackdrop from "./LoadingBackdrop.jsx";

export default function ProtectedRoute({ children }) {
  const { loadingUser, usuario } = useUser();

  if (loadingUser) {
    return <LoadingBackdrop open />;
  }
  if (!usuario) {
    return <Navigate to="/login" replace />;
  }
  return children;
}
