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
  optionId: string;
  value: string;
}

export interface WorksheetField {
  fieldId: string;
  name: string;
  type: FieldType;
  required: boolean;
  options?: FieldOption[];
}

export interface WorksheetSection {
  sectionId: string;
  name: string;
  fields: WorksheetField[];
}

export interface Worksheet {
  workSheetId: string;
  name: string;
  sections: WorksheetSection[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
