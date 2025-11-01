import network from "@/config/network.config";
import { JobRequest } from "@/types/job.type";
import { ApiResponseType } from "@/types/network.type";
import apis from "./apis";

export const saveJobRequest = async (
  payload: Omit<JobRequest, "jobId">
): ApiResponseType<JobRequest> => {
  try {
    return (await network.post(apis.jobRequest, payload)).data;
  } catch (error) {
    throw new Error(error.response.data.message);
  }
};
export const updateJobRequest = async (
  payload: JobRequest
): ApiResponseType<JobRequest> => {
  try {
    return (await network.put(apis.jobRequest, payload)).data;
  } catch (error) {
    throw new Error(error.response.data.message);
  }
};

export const getJobRequests = async (id: string): ApiResponseType<JobRequest[]> => {
  try {
    return (await network.get(`${apis.jobRequest}/${id}`)).data;
  } catch (error) {
    throw new Error(error.response.data.message);
  }
};
