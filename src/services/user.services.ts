import network from "@/config/network.config";
import apis from "./apis";
import { UserProfileType, UserType } from "@/types/auth";
import { ApiResponseType } from "@/types/network.type";
import { SettingsType } from "@/types/settings.type";
import { Company } from "@/admin/types/company.type";

export const loginServices = async (payload: {
  email: string;
  password: string;
}): ApiResponseType<{ user: UserType; access_token: string,settings:SettingsType }> => {
  try {
    return (await network.post(apis.login, payload)).data;
  } catch (error) {
    throw new Error(error.response.data.message);
  }
};

export const getUserProfile = async (): ApiResponseType<UserProfileType> => {
  try {
    return (await network.get(apis.userProfile)).data;
  } catch (error) {
    throw new Error(error.response.data.message);
  }
};

export const userRegistration = async (
  payload: any
): ApiResponseType<UserType> => {
  try {
    return (await network.post(apis.usersApi, payload)).data;
  } catch (error) {
    throw new Error(error.response.data.message);
  }
};

export const userUpdation = async (
  payload: any
): ApiResponseType<{user:UserType,company:Company}> => {
  try {
    return (await network.patch(`${apis.usersApi}/${payload.id}`, payload)).data;
  } catch (error) {
    throw new Error(error.response.data.message);
  }
};

export const getUsers = async (params: {
  skip: number;
  take: number;
  role?: string;
  department_id?: number;
  is_active?: boolean;
}): ApiResponseType<{list:UserType[],count:number}> => {
  try {
    const { skip, take, role, department_id, is_active } = params;
    let url = `${apis.usersApi}?skip=${skip}&take=${take}`;
    if (role) url += `&role=${role}`;
    if (department_id) url += `&department_id=${department_id}`;
    if (is_active !== undefined) url += `&is_active=${is_active}`;
    return (await network.get(url)).data;
  } catch (error) {
    throw new Error(error.response.data.message);
  }
};

export const deleteUser = async (id:number): ApiResponseType<UserType[]> => {
  try {
    return (await network.delete(`${apis.usersApi}/${id}`)).data;
  } catch (error) {
    throw new Error(error.response.data.message);
  }
};
