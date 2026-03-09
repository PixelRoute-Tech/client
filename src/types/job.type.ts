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
  id: string;
  client_id: number;
  client?: any;
  created_by: number;
  creator?: any;
  from_date: string;
  to_date: string;
  time_required?: string;
  status: string;
  purchase_order?: string;
  summary: string;
  details_provided?: string;
  comment?: string;
  safety_reference?: string;
  induction_details?: string;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
  ohs_requirements?: any[];
  ppe_requirements?: any[];
  test_methods?: any[];
  equipment?: any[];
  hse_procedures?: any[];
  uploaded_files?: string[];
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
