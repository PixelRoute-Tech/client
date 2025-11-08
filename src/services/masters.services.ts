import network from "@/config/network.config";
import apis from "./apis";
import { ApiResponseType } from "@/types/network.type";
type MasterResult = { label: string; _id: string; createdAt: string };
export const getDesignation = async (): ApiResponseType<MasterResult[]> => {
  try {
    return (await network.get(apis.designationMaster)).data;
  } catch (error) {
    throw new Error(error.response.data.message || "Oop! something went wrong");
  }
};

export const getDepartment = async (): ApiResponseType<MasterResult[]> => {
  try {
    return (await network.get(apis.departmentMaster)).data;
  } catch (error) {
    throw new Error(error.response.data.message || "Oop! something went wrong");
  }
};

export const getUserRole = async (): ApiResponseType<MasterResult[]> => {
  try {
    return (await network.get(apis.userRoles)).data;
  } catch (error) {
    throw new Error(error.response.data.message || "Oop! something went wrong");
  }
};

export const deleteDesignation = async (
  id: string
): ApiResponseType<MasterResult[]> => {
  try {
    return (await network.delete(apis.designationMaster, { data: { id } }))
      .data;
  } catch (error) {
    throw new Error(error.response.data.message || "Oop! something went wrong");
  }
};

export const deleteDepartment = async (
  id: string
): ApiResponseType<MasterResult[]> => {
  try {
    return (await network.delete(apis.departmentMaster, { data: { id } })).data;
  } catch (error) {
    throw new Error(error.response.data.message || "Oop! something went wrong");
  }
};

export const deleteUserRole = async (
  id: string
): ApiResponseType<MasterResult[]> => {
  try {
    return (await network.delete(apis.userRoles, { data: { id } })).data;
  } catch (error) {
    throw new Error(error.response.data.message || "Oop! something went wrong");
  }
};

export const saveDesignation = async (payload: {
  label: string;
}): ApiResponseType<MasterResult> => {
  try {
    return (await network.post(apis.designationMaster, payload)).data;
  } catch (error) {
    throw new Error(error.response.data.message || "Oop! something went wrong");
  }
};

export const saveDepartment = async (payload: {
  label: string;
}): ApiResponseType<MasterResult> => {
  try {
    return (await network.post(apis.departmentMaster, payload)).data;
  } catch (error) {
    throw new Error(error.response.data.message || "Oop! something went wrong");
  }
};

export const saveUserRole = async (payload: {
  label: string;
}): ApiResponseType<MasterResult> => {
  try {
    return (await network.post(apis.userRoles, payload)).data;
  } catch (error) {
    throw new Error(error.response.data.message || "Oop! something went wrong");
  }
};
