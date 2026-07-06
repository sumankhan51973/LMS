import { Navigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";

const ADMIN_EMAIL = "sumankhan51973@gmail.com";

export default function AdminProtectedRoute({ children }) {
  const { user, isLoaded } = useUser();

  if (!isLoaded) {
    return <div className="p-10 text-center">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  const email = user.primaryEmailAddress?.emailAddress;

  if (email !== ADMIN_EMAIL) {
    return <Navigate to="/" replace />;
  }

  return children;
}