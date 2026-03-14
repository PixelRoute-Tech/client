import network from "@/config/network.config";
import apis from "./apis";
import { ApiResponseType } from "@/types/network.type";
export type MasterResult = {
  id: number;
  name: string;
  is_deleted: boolean;
  created_at: string;
};
export const getDesignation = async (): ApiResponseType<MasterResult[]> => {
  try {
    return (await network.get(apis.designationMaster)).data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || error.message || "Oop! something went wrong");
  }
};

export const getDepartment = async (): ApiResponseType<MasterResult[]> => {
  try {
    return (await network.get(apis.departmentMaster)).data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || error.message || "Oop! something went wrong");
  }
};

export const getUserRole = async (): ApiResponseType<MasterResult[]> => {
  try {
    return (await network.get(apis.userRoles)).data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || error.message || "Oop! something went wrong");
  }
};

export const deleteDesignation = async (
  id: string | number,
): ApiResponseType<MasterResult[]> => {
  try {
    return (await network.delete(`${apis.designationMaster}/${id}`)).data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || error.message || "Oop! something went wrong");
  }
};

export const deleteDepartment = async (
  id: string | number,
): ApiResponseType<MasterResult[]> => {
  try {
    return (await network.delete(`${apis.departmentMaster}/${id}`)).data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || error.message || "Oop! something went wrong");
  }
};

export const deleteUserRole = async (
  id: string | number,
): ApiResponseType<MasterResult[]> => {
  try {
    return (await network.delete(`${apis.userRoles}/${id}`)).data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || error.message || "Oop! something went wrong");
  }
};

export const saveDesignation = async (payload: {
  name: string;
}): ApiResponseType<MasterResult> => {
  try {
    return (await network.post(apis.designationMaster, payload)).data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || error.message || "Oop! something went wrong");
  }
};

export const saveDepartment = async (payload: {
  name: string;
}): ApiResponseType<MasterResult> => {
  try {
    return (await network.post(apis.departmentMaster, payload)).data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || error.message || "Oop! something went wrong");
  }
};

export const saveUserRole = async (payload: {
  name: string;
}): ApiResponseType<MasterResult> => {
  try {
    return (await network.post(apis.userRoles, payload)).data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || error.message || "Oop! something went wrong");
  }
};
