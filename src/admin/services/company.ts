import network from "@/config/network.config";
import { Company } from "../types/company.type";
import { ApiResponseType } from "@/types/network.type";
import adminApi from "./api";

export const saveCompany = async (
  payload: Company
): ApiResponseType<Company> => {
  try {
    if (payload._id) {
      return (await network.put(adminApi.company, payload)).data;
    } else {
      return (await network.post(adminApi.company, payload)).data;
    }
  } catch (error) {
    throw new Error(error.response.data.message || "Oop! something went wrong");
  }
};

export const getCompany = async (): ApiResponseType<Company[]> => {
  try {
    return (await network.get(adminApi.company)).data;
  } catch (error) {
    throw new Error(error.response.data.message || "Oop! something went wrong");
  }
};
