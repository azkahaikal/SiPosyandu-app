import { Navigate } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";

export default function Index() {
  const { isAuthenticated } = useAuthStore();
  
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return <Navigate to="/" replace />;
}
