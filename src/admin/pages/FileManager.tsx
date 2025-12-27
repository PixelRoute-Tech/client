import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  ChevronRight,
  Home,
  LayoutGrid,
  List,
  FolderOpen,
  ArrowLeft,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { FileItem } from "../components/filemanager/FileItem";
import { FilePreviewModal } from "../components/filemanager/FilePreviewModal";
import { BreadcrumbItem, FileSystemItem } from "../types/fileSystem";

const initialFileSystem: FileSystemItem[] = [
  {
    type: "folder",
    name: "imagepath",
    children: [],
  },
  {
    type: "folder",
    name: "reportImages",
    children: [
      {
        type: "folder",
        name: "New folder",
        children: [
          {
            type: "file",
            name: "avatar_image1.png",
          },
          {
            type: "file",
            name: "report-image-1766029029367-preview.png",
          },
        ],
      },
    ],
  },
  {
    type: "file",
    name: "user-1766375357269.avif",
  },
  {
    type: "folder",
    name: "Documents",
    children: [
      {
        type: "file",
        name: "annual-report.pdf",
      },
      {
        type: "file",
        name: "contract.pdf",
      },
      {
        type: "folder",
        name: "Invoices",
        children: [
          {
            type: "file",
            name: "invoice-001.pdf",
          },
          {
            type: "file",
            name: "invoice-002.pdf",
          },
        ],
      },
    ],
  },
  {
    type: "folder",
    name: "Media",
    children: [
      {
        type: "file",
        name: "background-music.mp3",
      },
      {
        type: "file",
        name: "intro-video.mp4",
      },
    ],
  },
];

const FileManager = () => {
  const [fileSystem, setFileSystem] =
    useState<FileSystemItem[]>(initialFileSystem);
  const [currentPath, setCurrentPath] = useState<number[]>([]);
  const [breadcrumbs, setBreadcrumbs] = useState<BreadcrumbItem[]>([
    { name: "Home", path: [] },
  ]);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [previewFile, setPreviewFile] = useState<string | null>(null);
  const [deleteItem, setDeleteItem] = useState<{
    path: number[];
    name: string;
    type: string;
  } | null>(null);

  const getCurrentItems = (): FileSystemItem[] => {
    let items = fileSystem;
    for (const index of currentPath) {
      if (items[index]?.children) {
        items = items[index].children!;
      }
    }
    return items;
  };

  const navigateToFolder = (index: number, folderName: string) => {
    const newPath = [...currentPath, index];
    setCurrentPath(newPath);
    setBreadcrumbs([...breadcrumbs, { name: folderName, path: newPath }]);
  };

  const navigateToBreadcrumb = (breadcrumbIndex: number) => {
    const breadcrumb = breadcrumbs[breadcrumbIndex];
    setCurrentPath(breadcrumb.path);
    setBreadcrumbs(breadcrumbs.slice(0, breadcrumbIndex + 1));
  };

  const goBack = () => {
    if (currentPath.length > 0) {
      const newPath = currentPath.slice(0, -1);
      setCurrentPath(newPath);
      setBreadcrumbs(breadcrumbs.slice(0, -1));
    }
  };

  const deleteItemFromPath = (pathToDelete: number[]) => {
    const deleteRecursive = (
      items: FileSystemItem[],
      path: number[]
    ): FileSystemItem[] => {
      if (path.length === 1) {
        return items.filter((_, i) => i !== path[0]);
      }

      return items.map((item, i) => {
        if (i === path[0] && item.children) {
          return {
            ...item,
            children: deleteRecursive(item.children, path.slice(1)),
          };
        }
        return item;
      });
    };

    setFileSystem(deleteRecursive(fileSystem, pathToDelete));
  };

  const handleDelete = (index: number, name: string, type: string) => {
    setDeleteItem({ path: [...currentPath, index], name, type });
  };

  const confirmDelete = () => {
    if (deleteItem) {
      deleteItemFromPath(deleteItem.path);
      toast.success(
        `${deleteItem.type === "folder" ? "Folder" : "File"} "${
          deleteItem.name
        }" deleted`
      );
      setDeleteItem(null);
    }
  };

  const currentItems = getCurrentItems();

  // Sort: folders first, then files
  const sortedItems = [...currentItems].sort((a, b) => {
    if (a.type === "folder" && b.type === "file") return -1;
    if (a.type === "file" && b.type === "folder") return 1;
    return a.name.localeCompare(b.name);
  });

  return (
    <>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">File Manager</h1>
            <p className="text-muted-foreground text-sm mt-1">
              Browse and manage your files and folders
            </p>
          </div>

          {/* View Toggle */}
          <div className="flex items-center gap-1 bg-muted/50 p-1 rounded-lg">
            <Button
              variant={viewMode === "grid" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setViewMode("grid")}
              className="gap-2"
            >
              <LayoutGrid className="w-4 h-4" />
              <span className="hidden sm:inline">Grid</span>
            </Button>
            <Button
              variant={viewMode === "list" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setViewMode("list")}
              className="gap-2"
            >
              <List className="w-4 h-4" />
              <span className="hidden sm:inline">List</span>
            </Button>
          </div>
        </div>

        {/* Navigation Bar */}
        <div className="flex items-center gap-2 p-3 bg-card rounded-lg border">
          <Button
            variant="ghost"
            size="icon"
            onClick={goBack}
            disabled={currentPath.length === 0}
            className="flex-shrink-0"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>

          {/* Breadcrumbs */}
          <div className="flex items-center gap-1 overflow-x-auto flex-1 min-w-0">
            {breadcrumbs.map((crumb, index) => (
              <div
                key={index}
                className="flex items-center gap-1 flex-shrink-0"
              >
                {index > 0 && (
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                )}
                <button
                  onClick={() => navigateToBreadcrumb(index)}
                  className={cn(
                    "flex items-center gap-1.5 px-2 py-1 rounded-md text-sm transition-colors",
                    index === breadcrumbs.length - 1
                      ? "bg-primary/10 text-primary font-medium"
                      : "hover:bg-muted text-muted-foreground hover:text-foreground"
                  )}
                >
                  {index === 0 ? <Home className="w-3.5 h-3.5" /> : null}
                  <span className="truncate max-w-[120px]">{crumb.name}</span>
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* File Grid/List */}
        {sortedItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <FolderOpen className="w-16 h-16 text-muted-foreground/40 mb-4" />
            <h3 className="text-lg font-medium">This folder is empty</h3>
            <p className="text-sm text-muted-foreground mt-1">
              No files or folders to display
            </p>
          </div>
        ) : (
          <div
            className={cn(
              viewMode === "grid"
                ? "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3"
                : "flex flex-col gap-1"
            )}
          >
            {sortedItems.map((item, index) => {
              const originalIndex = currentItems.indexOf(item);
              return (
                <FileItem
                  key={`${item.name}-${index}`}
                  item={item}
                  viewMode={viewMode}
                  onFolderClick={() =>
                    navigateToFolder(originalIndex, item.name)
                  }
                  onFileClick={() => setPreviewFile(item.name)}
                  onDelete={() =>
                    handleDelete(originalIndex, item.name, item.type)
                  }
                />
              );
            })}
          </div>
        )}

        {/* Stats */}
        <div className="flex items-center gap-4 text-sm text-muted-foreground border-t pt-4">
          <span>
            {sortedItems.filter((i) => i.type === "folder").length} folders
          </span>
          <span>
            {sortedItems.filter((i) => i.type === "file").length} files
          </span>
        </div>
      </div>

      {/* File Preview Modal */}
      <FilePreviewModal
        isOpen={!!previewFile}
        onClose={() => setPreviewFile(null)}
        fileName={previewFile || ""}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteItem} onOpenChange={() => setDeleteItem(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {deleteItem?.type}?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{deleteItem?.name}"?
              {deleteItem?.type === "folder" && (
                <span className="block mt-2 text-destructive">
                  This will also delete all files and folders inside it.
                </span>
              )}
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default FileManager;
