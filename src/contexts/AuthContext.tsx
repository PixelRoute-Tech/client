import routes from "@/routes/routeList";
import router from "@/routes/routes";
import { AuthContextType, UserType } from "@/types/auth";
import { clearStorage, getItem, setItem, storageKeys } from "@/utils/storage";
import { createContext, FC, PropsWithChildren, useEffect, useState } from "react";
import { redirect } from "react-router-dom";

export const AuthContext = createContext<AuthContextType>({
  user: null,
  signin: () => {},
  signout: () => {},
  startLoading:()=>{},
  stopLoading:()=>{},
  loading:true
});

const AuthProvider: FC<PropsWithChildren> = ({ children }) => {
  const [user, setUser] = useState<UserType | null>(null);
  const [loading,setLoading] = useState(true)
  const signin = (user: any) => {
    setUser(user);
    setItem(storageKeys.user, user);
    router.navigate(routes.root,{replace:true})
  };

  const signout = (isLogout?: boolean) => {
    setUser(null);
    clearStorage();
    router.navigate(Boolean(isLogout) ? routes.login : routes.signout,{replace:true})
  };

  const startLoading = ()=>{
      setLoading(true)
  }

  const stopLoading = ()=>{
     setLoading(false)
  }

  useEffect(()=>{
      const data = getItem(storageKeys.user)
      setUser(data || null)
  },[])

  return (
    <AuthContext.Provider value={{ user, signin, signout,startLoading,stopLoading,loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
