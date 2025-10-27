import { Dispatch, SetStateAction } from "react";

export type UserType = {
  _id: string;
  id: string;
  userName: string;
  shortName: string;
  userRole: string;
  designation: string;
  department: string;
  email: string;
  imageUrl?: string;
  joinDate?: Date;
  rememberMe: boolean;
  password: string;
};
export type AuthContextType = {
  user: UserType | null;
  setUser: Dispatch<SetStateAction<UserType | null>>;
  signin: (data: { token: string; user: UserType }) => void;
  signout: (isLogout?: boolean) => void;
  loading: boolean;
  startLoading: () => void;
  stopLoading: () => void;
};
