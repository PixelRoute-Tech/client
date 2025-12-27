export interface FileSystemItem {
  type: 'folder' | 'file';
  name: string;
  children?: FileSystemItem[];
  size?: number;
}

export interface BreadcrumbItem {
  name: string;
  path: number[];
}
