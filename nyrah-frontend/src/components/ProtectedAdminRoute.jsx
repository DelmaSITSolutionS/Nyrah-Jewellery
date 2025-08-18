import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedAdminRoute = () => {
  const { user, isAuthenticated, loading } = useSelector((state) => state.user);
 
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-xl">
        Loading...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  if (user?.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default ProtectedAdminRoute;