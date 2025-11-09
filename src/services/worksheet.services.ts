import network from "@/config/network.config";
import { Worksheet } from "@/types/worksheet";
import apis from "./apis";
import { ApiResponseType } from "@/types/network.type";

export const saveWorkSheet = async (
  payload: Worksheet
): ApiResponseType<Worksheet> => {
  try {
    return (await network.post(apis.worksheet, payload)).data;
  } catch (error) {
    throw new Error(error.response.data.message);
  }
};
export const updateWorkSheet = async (
  payload: Worksheet
): ApiResponseType<Worksheet> => {
  try {
    return (await network.put(apis.worksheet, payload)).data;
  } catch (error) {
    throw new Error(error.response.data.message);
  }
};

export const getWorkSheets = async (): ApiResponseType<Worksheet[]> => {
  try {
    return (await network.get(apis.worksheet)).data;
  } catch (error) {
    throw new Error(error.response.data.message);
  }
};
