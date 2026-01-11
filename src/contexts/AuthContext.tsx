import { Company } from "@/admin/types/company.type";
import routes from "@/routes/routeList";
import router from "@/routes/routes";
import { logout } from "@/services/auth.services";
import { AuthContextType, UserType } from "@/types/auth";
import {
  clearAllCookies,
  clearStorage,
  getItem,
  setItem,
  storageKeys,
} from "@/utils/storage";
import { useMutation } from "@tanstack/react-query";
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

  const startLoading = () => {
    setLoading(true);
  };

  const stopLoading = () => {
    setLoading(false);
  };

  const { mutate: logoutCall,isPending:logoutLoading } = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      setUser(null);
      clearStorage();
      clearAllCookies();
      router.navigate(routes.login, {
        replace: true,
      });
    },
  });
  const signin = (data: {
    token: string;
    user: UserType;
    company: Company;
  }) => {
    setUser({ ...data.user, company: data.company });
    setItem(storageKeys.user, { ...data.user, company: data.company });
    setItem(storageKeys.token, data.token);
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      router.navigate(routes.root, { replace: true });
    }, 2000);
  };

  const signout = (isLogout?: boolean) => {
    logoutCall();
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
        loading:loading || logoutLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
