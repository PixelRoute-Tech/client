import network from "@/config/network.config";
import apis from "./apis";
import { ApiResponseType } from "@/types/network.type";
import { ClientType } from "@/types/client.type";

export const saveClient = async (payload: any):ApiResponseType<ClientType> => {
  try {
    return (
      await network.post(apis.clientApi, payload)
    ).data;
  } catch (error) {
    throw new Error(error.response.data.message);
  }
};

export const updateClient = async (payload: any):ApiResponseType<ClientType> => {
  try {
    const { clientId, ...rest } = payload;
    return (
      await network.patch(`${apis.clientApi}/${clientId}`, rest)
    ).data;
  } catch (error) {
    throw new Error(error.response.data.message);
  }
};

export const getClients = async (
  skip: number = 0,
  take: number = 10
): ApiResponseType<{ data: ClientType[]; count: number }> => {
  try {
    return (await network.get(apis.clientApi, { params: { skip, take } })).data;
  } catch (error) {
    throw new Error(error.response.data.message);
  }
};

export const deleteClients = async (id:string):ApiResponseType<ClientType>=>{
      try {
    return (
      await network.delete(`${apis.clientApi}/${id}`)
    ).data;
  } catch (error) {
    throw new Error(error.response.data.message);
  }
}
