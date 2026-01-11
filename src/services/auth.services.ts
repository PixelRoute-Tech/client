import network from "@/config/network.config";
import { UserType } from "@/types/auth";
import { ApiResponseType } from "@/types/network.type";
import { SettingsType } from "@/types/settings.type";
import apis from "./apis";

export const loginServices = async (payload: {
  email: string;
  password: string;
}): ApiResponseType<{
  user: UserType;
  token: string;
  settings: SettingsType;
}> => {
  try {
    return (await network.post(apis.login, payload)).data;
  } catch (error) {
    throw new Error(error.response.data.message);
  }
};

export const logout = async () => {
  try {
    return (await network.get(apis.logout)).data;
  } catch (error) {
    throw new Error(error.response.data.message);
  }
};
