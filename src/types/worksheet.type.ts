export type FieldType =
  | "textfield"
  | "checkbox"
  | "radio"
  | "textarea"
  | "select"
  | "autocomplete"
  | "autocomplete-chips"
  | "file"
  | "table";

export interface FieldOption {
  optionId: string;
  value: string;
}

export interface TableColumn {
  columnId: string;
  name: string;
  type: FieldType;
  options?: FieldOption[];
}

export interface TableActions {
  edit: boolean;
  view: boolean;
  delete: boolean;
}

export interface WorksheetField {
  fieldId: string;
  name: string;
  type: FieldType;
  required: boolean;
  inReport:boolean,
  options?: FieldOption[];
  tableColumns?: TableColumn[];
  tableActions?: TableActions;
}

export type SectionLayout = 1 | 2 | 3 | 4;

export interface WorksheetSection {
  sectionId: string;
  name: string;
  layout: SectionLayout;
  fields: WorksheetField[];
}

export interface Worksheet {
  workSheetId: string;
  description?: string;
  name: string;
  sections: WorksheetSection[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export type WorksheetRecord = {
  recordId: string;
  jobId?: string;
  clientId?: string;
  worksheetId: string;
  data: any;
  createdAt?: string;
  updatedAt?: string;
};

export interface ImageRecord {
  _id?: string;
  jobId: string;
  recordId: string;
  worksheetId: string;
  url: string; 
  preview:string;
  type: "Drawing" | "Photo";
  description: string;
  fileName: string;
  createdAt?: string; 
  updatedAt?: string;
}
