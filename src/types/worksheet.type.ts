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
  option_id: string;
  value: string;
}

export interface TableColumn {
  column_id: string;
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
  field_id: string;
  name: string;
  type: FieldType;
  required: boolean;
  in_report: boolean;
  options?: FieldOption[];
  table_columns?: TableColumn[];
  table_actions?: TableActions;
}

export type SectionLayout = 1 | 2 | 3 | 4;

export interface WorksheetSection {
  section_id: string;
  name: string;
  layout: SectionLayout;
  fields: WorksheetField[];
}

export interface Worksheet {
  worksheet_id: string;
  description?: string;
  name: string;
  sections: WorksheetSection[];
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export type WorksheetRecord = {
  record_id: string;
  job_id?: string;
  client_id?: string;
  worksheet_id: string;
  data: any;
  created_at?: string;
  updated_at?: string;
};

export interface ImageRecord {
  _id?: string;
  job_id: string;
  record_id: string;
  worksheet_id: string;
  url: string; 
  preview: string;
  type: "Drawing" | "Photo";
  description: string;
  file_name: string;
  created_at?: string; 
  updated_at?: string;
}
