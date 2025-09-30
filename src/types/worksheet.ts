export type FieldType = 
  | 'textfield'
  | 'checkbox'
  | 'radio'
  | 'textarea'
  | 'select'
  | 'autocomplete'
  | 'autocomplete-chips'
  | 'file';

export interface FieldOption {
  id: string;
  value: string;
}

export interface WorksheetField {
  id: string;
  name: string;
  type: FieldType;
  required: boolean;
  options?: FieldOption[];
}

export interface WorksheetSection {
  id: string;
  name: string;
  fields: WorksheetField[];
}

export interface Worksheet {
  id: string;
  name: string;
  sections: WorksheetSection[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
