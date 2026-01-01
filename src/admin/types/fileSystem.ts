export interface FileSystemItem {
  type: 'folder' | 'file';
  name: string;
  children?: FileSystemItem[];
  size?: number;
  path?:string
}

export interface BreadcrumbItem {
  name: string;
  path: number[];
}
