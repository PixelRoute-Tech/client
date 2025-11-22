import { Job } from "@/types/job.type";


const STORAGE_KEY = 'jobs';

export const jobStorage = {
  getAll: (): Job[] => {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  },

  save: (job: Job): Job => {
    const jobs = jobStorage.getAll();
    const newJob: Job = {
      ...job,
      jobId: `JOB-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    jobs.push(newJob);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(jobs));
    return newJob;
  },

  update: (id: string, updates: Partial<Job>): Job | null => {
    const jobs = jobStorage.getAll();
    const index = jobs.findIndex(j => j.jobId === id);
    if (index === -1) return null;
    
    jobs[index] = {
      ...jobs[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(jobs));
    return jobs[index];
  },

  delete: (id: string): boolean => {
    const jobs = jobStorage.getAll();
    const filtered = jobs.filter(j => j.jobId !== id);
    if (filtered.length === jobs.length) return false;
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    return true;
  },

  updateStatus: (id: string, status: Job['status']): Job | null => {
    return jobStorage.update(id, { status });
  },
};
