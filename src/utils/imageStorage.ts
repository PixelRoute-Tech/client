import { ImageData } from '@/types/image';

const STORAGE_KEY = 'app_images';

export const imageStorage = {
  getAll: (): ImageData[] => {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  },

  save: (image: Omit<ImageData, 'id' | 'createdAt'>): ImageData => {
    const images = imageStorage.getAll();
    const newImage: ImageData = {
      ...image,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    images.push(newImage);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(images));
    return newImage;
  },

  update: (id: string, updates: Partial<ImageData>): void => {
    const images = imageStorage.getAll();
    const index = images.findIndex(img => img.id === id);
    if (index !== -1) {
      images[index] = { ...images[index], ...updates };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(images));
    }
  },

  delete: (id: string): void => {
    const images = imageStorage.getAll();
    const filtered = images.filter(img => img.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  },
};
