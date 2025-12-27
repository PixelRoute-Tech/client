import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Download, FileText, FileImage, FileVideo, FileAudio, File } from 'lucide-react';

interface FilePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  fileName: string;
  fileSize?: number;
}

const getFileExtension = (fileName: string): string => {
  return fileName.split('.').pop()?.toLowerCase() || '';
};

const isImageFile = (fileName: string): boolean => {
  const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp', 'ico', 'avif'];
  return imageExtensions.includes(getFileExtension(fileName));
};

const isPdfFile = (fileName: string): boolean => {
  return getFileExtension(fileName) === 'pdf';
};

const isVideoFile = (fileName: string): boolean => {
  const videoExtensions = ['mp4', 'webm', 'ogg', 'mov', 'avi'];
  return videoExtensions.includes(getFileExtension(fileName));
};

const isAudioFile = (fileName: string): boolean => {
  const audioExtensions = ['mp3', 'wav', 'ogg', 'flac', 'aac'];
  return audioExtensions.includes(getFileExtension(fileName));
};

const getFileIcon = (fileName: string) => {
  if (isImageFile(fileName)) return FileImage;
  if (isPdfFile(fileName)) return FileText;
  if (isVideoFile(fileName)) return FileVideo;
  if (isAudioFile(fileName)) return FileAudio;
  return File;
};

const formatFileSize = (bytes?: number): string => {
  if (!bytes) return 'Unknown size';
  const units = ['B', 'KB', 'MB', 'GB'];
  let size = bytes;
  let unitIndex = 0;
  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }
  return `${size.toFixed(1)} ${units[unitIndex]}`;
};

export const FilePreviewModal = ({ isOpen, onClose, fileName, fileSize }: FilePreviewModalProps) => {
  const FileIcon = getFileIcon(fileName);
  const extension = getFileExtension(fileName);

  const renderPreview = () => {
    if (isImageFile(fileName)) {
      return (
        <div className="flex items-center justify-center bg-muted/30 rounded-lg p-4 min-h-[300px]">
          <div className="text-center">
            <FileImage className="w-24 h-24 mx-auto text-primary/60 mb-4" />
            <p className="text-sm text-muted-foreground">Image Preview</p>
            <p className="text-xs text-muted-foreground mt-1">{fileName}</p>
          </div>
        </div>
      );
    }

    if (isPdfFile(fileName)) {
      return (
        <div className="flex items-center justify-center bg-muted/30 rounded-lg p-4 min-h-[300px]">
          <div className="text-center">
            <FileText className="w-24 h-24 mx-auto text-red-500/60 mb-4" />
            <p className="text-sm text-muted-foreground">PDF Document</p>
            <p className="text-xs text-muted-foreground mt-1">{fileName}</p>
          </div>
        </div>
      );
    }

    if (isVideoFile(fileName)) {
      return (
        <div className="flex items-center justify-center bg-muted/30 rounded-lg p-4 min-h-[300px]">
          <div className="text-center">
            <FileVideo className="w-24 h-24 mx-auto text-purple-500/60 mb-4" />
            <p className="text-sm text-muted-foreground">Video File</p>
            <p className="text-xs text-muted-foreground mt-1">{fileName}</p>
          </div>
        </div>
      );
    }

    if (isAudioFile(fileName)) {
      return (
        <div className="flex items-center justify-center bg-muted/30 rounded-lg p-4 min-h-[300px]">
          <div className="text-center">
            <FileAudio className="w-24 h-24 mx-auto text-green-500/60 mb-4" />
            <p className="text-sm text-muted-foreground">Audio File</p>
            <p className="text-xs text-muted-foreground mt-1">{fileName}</p>
          </div>
        </div>
      );
    }

    return (
      <div className="flex items-center justify-center bg-muted/30 rounded-lg p-4 min-h-[300px]">
        <div className="text-center">
          <File className="w-24 h-24 mx-auto text-muted-foreground/60 mb-4" />
          <p className="text-sm text-muted-foreground">File Preview Not Available</p>
          <p className="text-xs text-muted-foreground mt-1">{fileName}</p>
        </div>
      </div>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileIcon className="w-5 h-5" />
            {fileName}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {renderPreview()}

          <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
            <div className="space-y-1">
              <p className="text-sm font-medium">File Details</p>
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span>Type: {extension.toUpperCase() || 'Unknown'}</span>
                <span>Size: {formatFileSize(fileSize)}</span>
              </div>
            </div>
            <Button variant="outline" size="sm" className="gap-2">
              <Download className="w-4 h-4" />
              Download
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
