import { Company } from "@/admin/types/company.type";
import routes from "@/routes/routeList";
import router from "@/routes/routes";
import { AuthContextType, UserType } from "@/types/auth";
import { clearStorage, getItem, setItem, storageKeys } from "@/utils/storage";
import {
  createContext,
  FC,
  PropsWithChildren,
  useEffect,
  useState,
} from "react";

export const AuthContext = createContext<AuthContextType>({
  user: null,
  setUser: () => {},
  signin: () => {},
  signout: () => {},
  startLoading: () => {},
  stopLoading: () => {},
  loading: true,
});

const AuthProvider: FC<PropsWithChildren> = ({ children }) => {
  const [user, setUser] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(true);
  const signin = (data: {
    access_token: string;
    user: UserType;
    // company: Company;
  }) => {
    setUser({ ...data.user,  });
    setItem(storageKeys.user, { ...data.user });
    setItem(storageKeys.accessToken, data.access_token);
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      router.navigate(routes.root, { replace: true });
    }, 2000);
  };

  const signout = (isLogout?: boolean) => {
    setUser(null);
    clearStorage();
    router.navigate(Boolean(isLogout) ? routes.login : routes.signout, {
      replace: true,
    });
  };

  const startLoading = () => {
    setLoading(true);
  };

  const stopLoading = () => {
    setLoading(false);
  };

  useEffect(() => {
    const data = getItem(storageKeys.user);
    setUser(data || null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        signin,
        signout,
        startLoading,
        stopLoading,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
