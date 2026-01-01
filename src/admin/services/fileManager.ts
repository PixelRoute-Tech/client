import network from "@/config/network.config";
import { ApiResponseType } from "@/types/network.type";
import adminApi from "./api";
import { FileSystemItem } from "../types/fileSystem";

export const getFilesAndFolders = async (): ApiResponseType<
  FileSystemItem[]
> => {
  try {
    return (await network.get(adminApi.fileManager)).data;
  } catch (error) {
    throw new Error(error.response.data.message);
  }
};

export const deleteFile = async (path: string): ApiResponseType<string> => {
  try {
    return (
      await network.delete(adminApi.fileManager, {
        data: { path },
      })
    ).data;
  } catch (error) {
    throw new Error(error.response.data.message);
  }
};
