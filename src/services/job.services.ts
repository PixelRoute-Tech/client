import network from "@/config/network.config";
import { Job, JobRequest } from "@/types/job.type";
import { ApiResponseType } from "@/types/network.type";
import apis from "./apis";

export const saveJobRequest = async (
  payload: any
): ApiResponseType<JobRequest> => {
  try {
    return (await network.post(`${apis.jobRequest}`, payload)).data;
  } catch (error) {
    throw new Error(error.response.data.message);
  }
};

export const updateJobRequest = async (
  payload: any
): ApiResponseType<JobRequest> => {
  try {
    const id = payload instanceof FormData ? payload.get("id") : payload.id;
    
    let dataToSend = payload;
    if (!(payload instanceof FormData)) {
      dataToSend = { ...payload };
      delete dataToSend.id;
    }
    
    return (await network.patch(`${apis.jobRequest}/${id}`, dataToSend)).data;
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
    return (await network.get(`${apis.jobRequest}/client/${id}`)).data;
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