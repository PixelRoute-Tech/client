import { jobStatus } from "@/components/forms/JobRequestForm";

export interface JobRequest {
  jobId?: string;
  createdAt?: Date;
  startDate?:Date;
  lastDate?: Date;
  clientId?: string;
  clientName?: string;
  clientEmail?:string;
  summary?: string;
  detailsProvided?: string;
  comment?: string;
  divisionRules?: string;
  testRows?: Array<{
    testMethod: string;
    testSpec: string;
    acceptanceSpec: string;
    toTable: string;
    testProcedure: string;
    tech: string;
  }>;
  status?: string;
}
