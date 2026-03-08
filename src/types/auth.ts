import { Company } from "@/admin/types/company.type";
import { MasterResult } from "@/services/masters.services";
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
  company: string | null;
  company_id: number | null;
  address: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type UserProfileType = {
  id: number;
  user_id: string;
  first_name: string;
  last_name: string;
  short_name: string;
  email: string;
  phone: string;
  address: string | null;
  avatar_url: string | null;
  is_active: boolean;
  is_deleted: boolean;
  designation_id: number;
  designation: MasterResult;
  department_id: number;
  department: MasterResult;
  user_role_id: number;
  user_role: MasterResult;
  company: null;
  company_id: null;
  created_by: null;
  updated_by: null;
  created_at: string;
  updated_at: string;
};

export type AuthContextType = {
  user: UserType | null;
  setUser: Dispatch<SetStateAction<UserType | null>>;
  signin: (data: { access_token: string; user: UserType }) => void;
  signout: (isLogout?: boolean) => void;
  loading: boolean;
  startLoading: () => void;
  stopLoading: () => void;
};
