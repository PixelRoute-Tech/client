import { Folder, File, FileImage, FileText, FileVideo, FileAudio, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { FileSystemItem } from '@/admin/types/fileSystem';

interface FileItemProps {
  item: FileSystemItem;
  onFolderClick: () => void;
  onFileClick: () => void;
  onDelete: () => void;
  viewMode: 'grid' | 'list';
}

const getFileExtension = (fileName: string): string => {
  return fileName.split('.').pop()?.toLowerCase() || '';
};

const getFileIcon = (fileName: string) => {
  const ext = getFileExtension(fileName);
  const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp', 'ico', 'avif'];
  const videoExtensions = ['mp4', 'webm', 'ogg', 'mov', 'avi'];
  const audioExtensions = ['mp3', 'wav', 'ogg', 'flac', 'aac'];
  
  if (imageExtensions.includes(ext)) return { icon: FileImage, color: 'text-blue-500' };
  if (ext === 'pdf') return { icon: FileText, color: 'text-red-500' };
  if (videoExtensions.includes(ext)) return { icon: FileVideo, color: 'text-purple-500' };
  if (audioExtensions.includes(ext)) return { icon: FileAudio, color: 'text-green-500' };
  return { icon: File, color: 'text-muted-foreground' };
};

export const FileItem = ({ item, onFolderClick, onFileClick, onDelete, viewMode }: FileItemProps) => {
  const isFolder = item.type === 'folder';
  const { icon: FileIcon, color } = isFolder 
    ? { icon: Folder, color: 'text-amber-500' } 
    : getFileIcon(item.name);

  const handleClick = () => {
    if (isFolder) {
      onFolderClick();
    } else {
      onFileClick();
    }
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete();
  };

  if (viewMode === 'list') {
    return (
      <div
        onClick={handleClick}
        className={cn(
          "group flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all duration-200",
          "hover:bg-accent/50 border border-transparent hover:border-border",
          "hover:shadow-sm"
        )}
      >
        <FileIcon className={cn("w-5 h-5 flex-shrink-0", color)} />
        <span className="flex-1 truncate text-sm font-medium">{item.name}</span>
        {isFolder && item.children && (
          <span className="text-xs text-muted-foreground">
            {item.children.length} items
          </span>
        )}
        <button
          onClick={handleDelete}
          className="opacity-0 group-hover:opacity-100 p-1.5 rounded-md hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-all"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <div
      onClick={handleClick}
      className={cn(
        "group relative flex flex-col items-center gap-2 p-4 rounded-xl cursor-pointer transition-all duration-200",
        "hover:bg-accent/50 border border-transparent hover:border-border",
        "hover:shadow-md hover:-translate-y-0.5"
      )}
    >
      <button
        onClick={handleDelete}
        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 p-1.5 rounded-md hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-all z-10"
      >
        <Trash2 className="w-4 h-4" />
      </button>
      
      <div className={cn(
        "w-16 h-16 flex items-center justify-center rounded-xl transition-transform duration-200",
        isFolder ? "bg-amber-500/10" : "bg-muted/50",
        "group-hover:scale-110"
      )}>
        <FileIcon className={cn("w-8 h-8", color)} />
      </div>
      
      <div className="w-full text-center">
        <p className="text-sm font-medium truncate px-1" title={item.name}>
          {item.name}
        </p>
        {isFolder && item.children && (
          <p className="text-xs text-muted-foreground">
            {item.children.length} items
          </p>
        )}
      </div>
    </div>
  );
};
