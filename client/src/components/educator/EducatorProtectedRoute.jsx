import { Navigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";

export default function EducatorProtectedRoute({ children }) {
  const { user, isLoaded } = useUser();

  if (!isLoaded) {
    return <div className="p-10 text-center">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (user.publicMetadata.role !== "educator") {
    return <Navigate to="/" replace />;
  }

  return children;
}