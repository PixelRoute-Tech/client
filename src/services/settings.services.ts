import network from "@/config/network.config"
import apis from "./apis"
import { SettingsType } from "@/types/settings.type";
import { ApiResponseType } from "@/types/network.type";

export const getSettings = async ({id}:{id:string}):ApiResponseType<SettingsType>=>{
     try {
        return (await network.get(`${apis.settings}/${id}`)).data
     } catch (error) {
        throw new Error(error.response.data.message);
     }
}

export const updateSettings = async (payload:SettingsType & {userId:string}):ApiResponseType<SettingsType>=>{
     try {
        return (await network.put(`${apis.settings}`,payload)).data
     } catch (error) {
        throw new Error(error.response.data.message);
     }
}