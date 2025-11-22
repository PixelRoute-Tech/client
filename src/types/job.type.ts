import { jobStatus } from "@/components/forms/JobRequestForm";
export type TechRow = {
  testMethod: string;
  testSpec: string;
  acceptanceSpec: string;
  toTable: string;
  testProcedure: string;
  tech: string;
};
export interface JobRequest {
  jobId?: string;
  createdBy: string;
  createdAt?: Date;
  startDate?: Date;
  lastDate?: Date;
  clientId?: string;
  clientName?: string;
  clientAddress?: string;
  clientEmail?: string;
  summary?: string;
  detailsProvided?: string;
  comment?: string;
  divisionRules?: string;
  testRows: Array<TechRow>;
  status?: string;
}

export interface Job {
  _id: string;
  jobId: string;
  tech: string;
  status: "Pending" | "Completed" | "In progress";
  testMethod: string;
  jobDetails: {
    clientId: string;
    createdAt: string;
    clientName: string;
    lastDate: string;
  };

  worksheetName: string;
  technician: string;
}
