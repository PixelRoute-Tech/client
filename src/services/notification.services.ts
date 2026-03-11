import network from "@/config/network.config";
import apis from "./apis";
import { ApiResponseType } from "@/types/network.type";
import { Notification } from "@/types/types";
export const getNotification = async (id: string | number):ApiResponseType<Notification[]> => {
  try {
    return (await network.get(`${apis.notification}/${id}`)).data;
  } catch (error) {
    throw new Error(
      error.response.data.message || "Oops! Something went wrong"
    );
  }
};

export const updateNotification = async ({
  id,
  isRead,
}: {
  id: string | number;
  isRead: boolean;
}):ApiResponseType<string> => {
  try {
    return (await network.put(`${apis.notification}/${id}`, { isRead })).data;
  } catch (error) {
    throw new Error(
      error.response.data.message || "Oops! Something went wrong"
    );
  }
};
