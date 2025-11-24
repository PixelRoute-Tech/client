export interface ImageData {
  id: string;
  url: string;
  type: 'Drawing' | 'Photo';
  description: string;
  createdAt: string;
  canvasData?: string;
}
