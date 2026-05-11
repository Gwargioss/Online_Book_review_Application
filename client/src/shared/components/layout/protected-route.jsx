import { Navigate, Outlet, useLocation } from "react-router-dom";
import { ROUTES } from "../../constants/routes";
import { useAuth } from "../../../features/auth/auth-context";
import { Spinner } from "../ui/spinner";

export function ProtectedRoute() {
  const { isAuthenticated, isReady } = useAuth();
  const location = useLocation();

  if (!isReady) {
    return (
      <div className="screen-loader">
        <Spinner />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.login} state={{ from: location }} replace />;
  }

  return <Outlet />;
}
