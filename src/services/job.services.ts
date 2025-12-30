import network from "@/config/network.config";
import { Job, JobRequest } from "@/types/job.type";
import { ApiResponseType } from "@/types/network.type";
import apis from "./apis";

export const saveJobRequest = async (
  payload: FormData
): ApiResponseType<JobRequest> => {
  try {
    return (await network.post(apis.jobRequest, payload)).data;
  } catch (error) {
    throw new Error(error.response.data.message);
  }
};
export const updateJobRequest = async (
  payload: FormData
): ApiResponseType<JobRequest> => {
  try {
    return (await network.put(`${apis.jobRequest}/${payload.get("clientId")}`, payload)).data;
  } catch (error) {
    throw new Error(error.response.data.message);
  }
};

export const deleteJobRequest = async (
  id: string
): ApiResponseType<JobRequest> => {
  try {
    return (await network.delete(`${apis.jobRequest}/${id}`)).data;
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

export const getJobDetails = async (id:string):ApiResponseType<JobRequest> =>{
     try {
       return (await network.get(`${apis.jobRequestDetails}/${id}`)).data
     } catch (error) {
      throw new Error(error.response.data.message || "Oops! Something went wrong")
     }
}

export const getJobByUser = async (id:string):ApiResponseType<{pending:Job[],inProgress:Job[],completed:Job[]}>=>{
     try {
       return (await network.get(`${apis.jobsByUserId}/${id}`)).data
     } catch (error) {
      throw new Error(error.response.data.message || "Oops! Something went wrong")
     }
}

export const updateJobData = async (payload:Job):ApiResponseType<{pending:Job[],inProgress:Job[],completed:Job[]}>=>{
        try {
       return (await network.put(`${apis.jobsByUserId}/${payload._id}`,payload)).data
     } catch (error) {
      throw new Error(error.response.data.message || "Oops! Something went wrong")
     }
}