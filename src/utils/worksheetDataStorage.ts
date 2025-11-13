export interface WorksheetDataRecord {
  id: string;
  worksheetId: string;
  data: any;
  createdAt: string;
  updatedAt: string;
}

const STORAGE_KEY = 'worksheet_data';

export const worksheetDataStorage = {
  getAll: (): WorksheetDataRecord[] => {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  },

  getByWorksheetId: (worksheetId: string): WorksheetDataRecord[] => {
    const records = worksheetDataStorage.getAll();
    return records.filter(r => r.worksheetId === worksheetId);
  },

  getById: (id: string): WorksheetDataRecord | undefined => {
    const records = worksheetDataStorage.getAll();
    return records.find(r => r.id === id);
  },

  save: (record: WorksheetDataRecord): void => {
    const records = worksheetDataStorage.getAll();
    const index = records.findIndex(r => r.id === record.id);
    
    if (index >= 0) {
      records[index] = { ...record, updatedAt: new Date().toISOString() };
    } else {
      records.push({ ...record, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
    }
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
  },

  delete: (id: string): void => {
    const records = worksheetDataStorage.getAll().filter(r => r.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
  }
};
