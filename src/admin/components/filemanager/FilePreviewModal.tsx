import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Download,
  FileText,
  FileImage,
  FileVideo,
  FileAudio,
  File,
} from "lucide-react";

/* -------------------------------------------------------------------------- */
/*                                    TYPES                                   */
/* -------------------------------------------------------------------------- */

interface FilePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  fileName: string;
  fileUrl: string; // 👈 required for preview
  fileSize?: number;
}

/* -------------------------------------------------------------------------- */
/*                               FILE HELPERS                                 */
/* -------------------------------------------------------------------------- */

const getFileExtension = (fileName: string): string =>
  fileName.split(".").pop()?.toLowerCase() || "";

const isImageFile = (fileName: string): boolean =>
  ["jpg", "jpeg", "png", "gif", "webp", "svg", "bmp", "ico", "avif"].includes(
    getFileExtension(fileName)
  );

const isPdfFile = (fileName: string): boolean =>
  getFileExtension(fileName) === "pdf";

const isVideoFile = (fileName: string): boolean =>
  ["mp4", "webm", "ogg", "mov", "avi"].includes(getFileExtension(fileName));

const isAudioFile = (fileName: string): boolean =>
  ["mp3", "wav", "ogg", "flac", "aac"].includes(getFileExtension(fileName));

const getFileIcon = (fileName: string) => {
  if (isImageFile(fileName)) return FileImage;
  if (isPdfFile(fileName)) return FileText;
  if (isVideoFile(fileName)) return FileVideo;
  if (isAudioFile(fileName)) return FileAudio;
  return File;
};

const formatFileSize = (bytes?: number): string => {
  if (!bytes) return "Unknown size";
  const units = ["B", "KB", "MB", "GB"];
  let size = bytes;
  let unitIndex = 0;

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }

  return `${size.toFixed(1)} ${units[unitIndex]}`;
};

/* -------------------------------------------------------------------------- */
/*                             PREVIEW COMPONENT                               */
/* -------------------------------------------------------------------------- */

export const FilePreviewModal = ({
  isOpen,
  onClose,
  fileName,
  fileUrl,
  fileSize,
}: FilePreviewModalProps) => {
  const FileIcon = getFileIcon(fileName);
  const extension = getFileExtension(fileName);

  const renderPreview = () => {
    if (isImageFile(fileName)) {
      return (
        <img
          src={fileUrl}
          alt={fileName}
          className="max-h-[400px] max-w-full mx-auto rounded-lg object-contain"
        />
      );
    }

    if (isPdfFile(fileName)) {
      return (
        <iframe
          src={fileUrl}
          title={fileName}
          className="w-full h-[400px] rounded-lg"
        />
      );
    }

    if (isVideoFile(fileName)) {
      return (
        <video
          src={fileUrl}
          controls
          className="w-full max-h-[400px] rounded-lg"
        />
      );
    }

    if (isAudioFile(fileName)) {
      return <audio src={fileUrl} controls className="w-full" />;
    }

    return (
      <div className="flex items-center justify-center bg-muted/30 rounded-lg p-6 min-h-[300px]">
        <div className="text-center">
          <File className="w-16 h-16 mx-auto mb-3 text-muted-foreground/60" />
          <p className="text-sm text-muted-foreground">
            Preview not available
          </p>
        </div>
      </div>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[650px]">
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
                <span>Type: {extension.toUpperCase() || "Unknown"}</span>
                <span>Size: {formatFileSize(fileSize)}</span>
              </div>
            </div>

            <Button variant="outline" size="sm" className="gap-2" asChild>
              <a href={fileUrl} download>
                <Download className="w-4 h-4" />
                Download
              </a>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
