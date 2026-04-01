import { Company } from "@/admin/types/company.type";
import routes from "@/routes/routeList";
import router from "@/routes/routes";
import { AuthContextType, UserType, UserPrivilegeType } from "@/types/auth";
import { clearStorage, getItem, setItem, storageKeys } from "@/utils/storage";
import {
  createContext,
  FC,
  PropsWithChildren,
  useEffect,
  useState,
} from "react";
import { getMyPrivileges } from "@/services/privilege.services";
import ModuleLoading from "@/components/ui/module-loading";

export const AuthContext = createContext<AuthContextType>({
  user: null,
  setUser: () => {},
  privileges: [],
  setPrivileges: () => {},
  signin: () => {},
  signout: () => {},
  startLoading: () => {},
  stopLoading: () => {},
  loading: true,
  checkPermission: () => true, // default allowed
});

const AuthProvider: FC<PropsWithChildren> = ({ children }) => {
  const [user, setUser] = useState<UserType | null>(null);
  const [privileges, setPrivileges] = useState<UserPrivilegeType[]>([]);
  const [loading, setLoading] = useState(true);
  const [isInitializing, setIsInitializing] = useState(false);

  const signin = async (data: {
    access_token: string;
    user: UserType;
    privileges?: UserPrivilegeType[];
  }) => {
    // 1. Save core auth data immediately
    setItem(storageKeys.user, { ...data.user });
    setItem(storageKeys.accessToken, data.access_token);
    setUser({ ...data.user });
    
    // 2. Start software initialization sequence
    setIsInitializing(true);
    
    // 3. Load privileges (minimum load time for aesthetics)
    await Promise.all([
        loadPrivileges(),
        new Promise(resolve => setTimeout(resolve, 3000)) // Professional feel
    ]);
    
    // 4. Finalize
    setIsInitializing(false);
    router.navigate(routes.root, { replace: true });
  };

  const signout = (isLogout?: boolean) => {
    setUser(null);
    setPrivileges([]);
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

  const checkPermission = (menuId: string, action: 'read' | 'write' | 'delete'): boolean => {
    if (user?.user_role?.name === "Admin") return true; // Admins have full access
    const privilege = privileges.find((p) => p.menu_id === menuId);
    if (!privilege) return false;
    
    switch (action) {
      case 'read': return privilege.can_read;
      case 'write': return privilege.can_write;
      case 'delete': return privilege.can_delete;
      default: return false;
    }
  };

  const loadPrivileges = async () => {
    try {
        const data = await getMyPrivileges();
        if (data.success) {
            setPrivileges(data.data);
            setItem(storageKeys.privileges, data.data);
        }
    } catch (error) {
        console.error("Failed to load privileges:", error);
    }
  };

  useEffect(() => {
    const data = getItem(storageKeys.user);
    const savedPrivileges = getItem(storageKeys.privileges);
    
    setUser(data || null);
    if (savedPrivileges) {
        setPrivileges(savedPrivileges);
    } else if (data) {
        loadPrivileges();
    }
    setLoading(false);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        privileges,
        setPrivileges,
        signin,
        signout,
        startLoading,
        stopLoading,
        loading,
        checkPermission,
      }}
    >
      {isInitializing && <ModuleLoading message="Initializing secure modules..." />}
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
