import network from "@/config/network.config";
import apis from "./apis";
import { UserType } from "@/types/auth";
import { ApiResponseType } from "@/types/network.type";

export const loginServices = async (payload: {
  email: string;
  password: string;
}): ApiResponseType<{ user: UserType; token: string }> => {
  try {
    return (await network.post(apis.login, payload)).data;
  } catch (error) {
    throw new Error(error.response.data.message)
  }
};
