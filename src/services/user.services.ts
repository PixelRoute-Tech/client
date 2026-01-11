import network from "@/config/network.config";
import apis from "./apis";
import { UserType } from "@/types/auth";
import { ApiResponseType } from "@/types/network.type";
import { SettingsType } from "@/types/settings.type";
import { Company } from "@/admin/types/company.type";

export const userRegistration = async (
  payload: FormData
): ApiResponseType<UserType> => {
  try {
    return (
      await network.post(apis.userRegistration, payload, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
    ).data;
  } catch (error) {
    throw new Error(error.response.data.message);
  }
};

export const userUpdation = async (
  payload: FormData
): ApiResponseType<{user:UserType,company:Company}> => {
  try {
    return (
      await network.put(apis.usersApi, payload, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
    ).data;
  } catch (error) {
    throw new Error(error.response.data.message);
  }
};

export const getUsers = async (): ApiResponseType<UserType[]> => {
  try {
    return (await network.get(apis.usersApi)).data;
  } catch (error) {
    throw new Error(error.response.data.message);
  }
};

export const deleteUser = async (id:string): ApiResponseType<UserType[]> => {
  try {
    return (await network.delete(`${apis.usersApi}/${id}`)).data;
  } catch (error) {
    throw new Error(error.response.data.message);
  }
};
