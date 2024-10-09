import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem("token");
  const user = useSelector((state) => state.auth.user);
  const status = useSelector((state) => state.auth.status);

  if (!token) {
    return <Navigate to="/" replace />;
  }

  if (
    status !== "loading" &&
    allowedRoles &&
    user &&
    !allowedRoles.includes(user?.type)
  ) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
