import { Company } from "@/admin/types/company.type";


const STORAGE_KEY = 'companies';

export const companyStorage = {
  getAll: (): Company[] => {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  },

  getById: (id: string): Company | undefined => {
    const companies = companyStorage.getAll();
    return companies.find(company => company._id === id);
  },

  save: (company: Omit<Company, 'id' | 'createdAt' | 'updatedAt'>): Company => {
    const companies = companyStorage.getAll();
    const newCompany: Company = {
      ...company,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    companies.push(newCompany);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(companies));
    return newCompany;
  },

  update: (id: string, updates: Partial<Omit<Company, 'id' | 'createdAt'>>): Company | null => {
    const companies = companyStorage.getAll();
    const index = companies.findIndex(company => company._id === id);
    
    if (index === -1) return null;
    
    companies[index] = {
      ...companies[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(companies));
    return companies[index];
  },

  delete: (id: string): boolean => {
    const companies = companyStorage.getAll();
    const filtered = companies.filter(company => company._id !== id);
    
    if (filtered.length === companies.length) return false;
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    return true;
  },
};
