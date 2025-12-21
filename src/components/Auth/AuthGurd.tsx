import { useAuth } from "@/hooks/useAuth";
import routes from "@/routes/routeList";
import { getItem, storageKeys } from "@/utils/storage";
import { Navigate } from "react-router-dom";

function AuthGurd({ children }) {
  const user = getItem(storageKeys.user);
  if (user) {
    return children;
  } else {
    return <Navigate to={routes.landing} replace={true} />;
  }
}

export default AuthGurd;
