import { Company } from "@/admin/types/company.type";
import { Dispatch, SetStateAction } from "react";

export type UserType = {
  id: number;
  user_id: string;
  email: string;
  first_name: string;
  last_name: string;
  short_name: string;
  phone: string;
  avatar_url: string | null;
  designation: string | null;
  designation_id: number | null;
  department: string | null;
  department_id: number | null;
  user_role: string | null;
  user_role_id: number | null;
  company:string | null;
  company_id:number | null;
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
