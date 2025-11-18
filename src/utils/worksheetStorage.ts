import { Worksheet } from '@/types/worksheet.type';

const STORAGE_KEY = 'worksheets';

export const worksheetStorage = {
  getAll: (): Worksheet[] => {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  },

  getById: (id: string): Worksheet | undefined => {
    const worksheets = worksheetStorage.getAll();
    return worksheets.find(w => w.id === id);
  },

  save: (worksheet: Worksheet): void => {
    const worksheets = worksheetStorage.getAll();
    const index = worksheets.findIndex(w => w.id === worksheet.id);
    
    if (index >= 0) {
      worksheets[index] = { ...worksheet, updatedAt: new Date().toISOString() };
    } else {
      worksheets.push(worksheet);
    }
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(worksheets));
  },

  delete: (id: string): void => {
    const worksheets = worksheetStorage.getAll().filter(w => w.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(worksheets));
  },

  toggleActive: (id: string): void => {
    const worksheets = worksheetStorage.getAll();
    const worksheet = worksheets.find(w => w.id === id);
    
    if (worksheet) {
      worksheet.isActive = !worksheet.isActive;
      worksheet.updatedAt = new Date().toISOString();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(worksheets));
    }
  }
};
