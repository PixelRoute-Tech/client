import network from "@/config/network.config";
import { ImageRecord, Worksheet, WorksheetRecord } from "@/types/worksheet.type";
import apis from "./apis";
import { ApiResponseType } from "@/types/network.type";
import { JobRequest, TechRow } from "@/types/job.type";
import { ClientType } from "@/types/client.type";
import { ReplaceField } from "@/types/types";
import { UserType } from "@/types/auth";

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
export const getWorkSheet = async (id: string): ApiResponseType<Worksheet> => {
  try {
    return (await network.get(`${apis.worksheet}/${id}`)).data;
  } catch (error) {
    throw new Error(error.response.data.message);
  }
};
export const getWorkSheetslList = async (): ApiResponseType<Worksheet[]> => {
  try {
    return (await network.get(`${apis.worksheet}/list`)).data;
  } catch (error) {
    throw new Error(error.response.data.message);
  }
};

export const getRecord = async (
  id: string
): ApiResponseType<WorksheetRecord> => {
  try {
    return (await network.get(`${apis.worksheetRecord}/${id}`)).data;
  } catch (error) {
    throw new Error(error.response.data.message);
  }
};

export const saveRecord = async (
  params: WorksheetRecord
): ApiResponseType<WorksheetRecord> => {
  try {
    return (await network.post(`${apis.worksheetRecord}`, params)).data;
  } catch (error) {
    throw new Error(error.response.data.message);
  }
};

export const updateRecord = async (
  params: WorksheetRecord
): ApiResponseType<WorksheetRecord> => {
  try {
    return (await network.put(`${apis.worksheetRecord}`, params)).data;
  } catch (error) {
    throw new Error(error.response.data.message);
  }
};

export type TechRowTemp = ReplaceField<
  TechRow,
  "tech",
  {
    _id: string;
    id: string;
    userName: string;
    email: string;
  }
>;

export type JobRequestTemp = ReplaceField<
  JobRequest,
  "testRows",
  Array<TechRowTemp>
>;

export const getRecordData = async (
  id: string
): ApiResponseType<
  {
    recordId: string;
    record: WorksheetRecord;
    client: ClientType;
    worksheet: Worksheet;
    job: JobRequestTemp;
    jobrequest: JobRequest;
    technician: UserType;
    images:ImageRecord[]
  }[]
> => {
  try {
    return (await network.get(`${apis.reportRecordData}/${id}`)).data;
  } catch (error) {
    throw new Error(error.response.data.message);
  }
};

export const uploadRecordImage = async (
  payload: FormData
): ApiResponseType<ImageRecord> => {
  try {
    return (
      await network.post(apis.reportImages, payload, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
    ).data;
  } catch (error) {
    throw new Error(error.response.data.message);
  }
};

export const updateRecordImage = async (
  payload: FormData
): ApiResponseType<ImageRecord> => {
  try {
    return (
      await network.put(`${apis.reportImages}/${payload.get("id")}?previousfilepath${payload.get("previousFilePath")}&previouspreviewpath=${payload.get("previousPreviewPath")}`, payload, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
    ).data;
  } catch (error) {
    throw new Error(error.response.data.message);
  }
};

export const getImageRecordImages = async (id:string):ApiResponseType<ImageRecord[]>=>{
  try {
    return (await network.get(`${apis.reportImages}/${id}`)).data
  } catch (error) {
     throw new Error(error.response.data.message);
  }
}
