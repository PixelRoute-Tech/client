import { jobStatus } from "@/components/forms/JobRequestForm";
export type TechRow = {
  testMethod: string;
  testSpec: string;
  acceptanceSpec: string;
  toTable: string;
  testProcedure: string;
  tech: string;
};

// 1. For dynamic text inputs (Equipment and HSE Procedures)
export interface DynamicSafetyItem {
  value: string;
}

// 2. For the OHS Checkboxes
export interface OHSRequirements {
  swms: boolean;
  jsa: boolean;
  safetyBoots: boolean;
}

// 3. For the PPE Checkboxes
export interface PPERequired {
  hardhat: boolean;
  bumpGap: boolean;
  highVis: boolean;
  longSleeve: boolean;
  safetyGlasses: boolean;
  safetyBoots: boolean;
  faceShield: boolean;
  weldGlass: boolean;
  hearingProtection: boolean;
  electricalProtection: boolean;
  respiratoryProtection: boolean;
}
export type JobRequestFileList = {
  fileName: string;
  size:number | string;
  url: string;
};
// 5. The Main Job Request Interface
export interface JobRequest {
  _id?: string;
  jobId?: string;
  createdBy: string;
  createdAt?: Date;
  startDate: Date | string;
  lastDate: Date | string;
  clientId?: string;
  clientName?: string;
  clientAddress?: string;
  clientEmail?: string;
  purchaseOrder?: string;
  summary: string;
  detailsProvided: string;
  comment?: string;
  timeRequired: string;
  status: string;
  ohsRequirements: OHSRequirements;
  ppeRequired: PPERequired;
  safetyReference?: string;
  equipmentList: DynamicSafetyItem[];
  siteInduction?: string;
  hseProcedures: DynamicSafetyItem[];
  // requiredDocument: string;
  testRows: TechRow[];
  files?: JobRequestFileList[];
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
