import network from "@/config/network.config";
import { Worksheet, WorksheetRecord } from "@/types/worksheet.type";
import apis from "./apis";
import { ApiResponseType } from "@/types/network.type";
import { JobRequest } from "@/types/job.type";
import { ClientType } from "@/types/client.type";

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

export const getRecordData = async (
  id: string
): ApiResponseType<{
  record: WorksheetRecord;
  worksheet: Worksheet;
  job: JobRequest;
  client:ClientType
}[]> => {
  try {
    return (await network.get(`${apis.reportRecordData}/${id}`)).data;
  } catch (error) {
    throw new Error(error.response.data.message);
  }
};
