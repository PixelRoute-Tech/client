import network from "@/config/network.config";
import apis from "./apis";
import { ApiResponseType } from "@/types/network.type";
import { ClientType } from "@/types/client.type";

export const saveClient = async (payload: FormData):ApiResponseType<ClientType> => {
  try {
    return (
      await network.post(apis.clientApi, payload, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
    ).data;
  } catch (error) {
    throw new Error(error.response.data.message);
  }
};

export const updateClient = async (payload: FormData):ApiResponseType<ClientType> => {
  try {
    return (
      await network.put(apis.clientApi, payload, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
    ).data;
  } catch (error) {
    throw new Error(error.response.data.message);
  }
};

export const getClients = async ():ApiResponseType<ClientType[]>=>{
      try {
    return (
      await network.get(apis.clientApi)
    ).data;
  } catch (error) {
    throw new Error(error.response.data.message);
  }
}

export const deleteClients = async (id:string):ApiResponseType<ClientType>=>{
      try {
    return (
      await network.delete(`${apis.clientApi}/${id}`)
    ).data;
  } catch (error) {
    throw new Error(error.response.data.message);
  }
}
