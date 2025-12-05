import { useState, useRef, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Upload, Camera } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { CameraCapture } from "./CameraCapture";
import { ImageRecord } from "@/types/worksheet.type";
import { ImageCard } from "./ImageCard";
import { ReactSketchCanvasRef, CanvasPath } from "react-sketch-canvas";
import { base64ToFile, filetypes } from "@/utils/fileOperations";
import { baseURL } from "@/config/network.config";
export type OnUploadParams = {
  file: File | string;
  preview: File | string;
  type: "Drawing" | "Photo";
  path: CanvasPath[];
  description: string;
};

export const dimention = {
   width:535,
   height:450
}

interface ImageUploadModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpload: (params: OnUploadParams) => void;
  loading?: boolean;
  image?: ImageRecord | null;
}

export const ImageUploadModal = ({
  open,
  onOpenChange,
  onUpload,
  loading,
  image,
}: ImageUploadModalProps) => {
  const [imageType, setImageType] = useState<"Drawing" | "Photo">("Photo");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const blobRef = useRef<Blob>(null);
  const canvasRef = useRef<ReactSketchCanvasRef>(null);
  const { toast } = useToast();

  function resizeImage(file: File | string): Promise<Blob> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = typeof file == "string" ? file : URL.createObjectURL(file);
      img.onload = () => {
        const fileType = typeof file == "string" ? "image/jpeg" : file?.type;
        const canvas = document.createElement("canvas");
        canvas.width = dimention.width;
        canvas.height = dimention.height;
        const ctx = canvas.getContext("2d");

        ctx!.drawImage(img, 0, 0, dimention.width, dimention.height);

        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject("Compression failed.");
            }
          },
          fileType,
          0.9 // quality (0–1)
        );
      };

      img.onerror = reject;
    });
  }

  const handleFileChange = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast({
        title: "Invalid file",
        description: "Please select an image file",
        variant: "destructive",
      });
      return;
    }

    blobRef.current = await resizeImage(file);
    setImageUrl(URL.createObjectURL(blobRef.current));
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileChange(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleSubmit = async () => {
    if (!imageUrl && !image.url) {
      toast({
        title: "No image",
        description: "Please select or provide an image",
        variant: "destructive",
      });
      return;
    }
    console.log(await canvasRef.current.exportImage("png"));
    let file = null;
    if (blobRef.current) {
      const ext = filetypes[blobRef.current.type];
      file = new File([blobRef.current], `selctedImage.${ext}`, {
        type: blobRef.current.type,
      });
    }
    onUpload({
      file,
      preview: await base64ToFile(
        await canvasRef.current.exportImage("png"),
        "preview.png"
      ),
      type: imageType,
      path: await canvasRef.current.exportPaths(),
      description,
    });

    // Reset form
    setImageUrl("");
    setDescription("");
    setImageType("Photo");
    onOpenChange(false);
  };

  const setUpUrl = (url: string) => {
    return url.startsWith("http") ? url : `${baseURL}${url}`;
  };

  const loadPath = async () => {
    if (image?.fileName) {
      const result = await fetch(
        `${baseURL}/uploads/imagepath/${image.fileName}.json`
      );
      const loadedPath = await result.json();
      canvasRef.current.loadPaths(loadedPath);
    }
  };

  useEffect(() => {
    loadPath();
    return () => {
      setImageUrl("");
      setDescription("");
      setImageType("Photo");
      if (imageUrl.includes("blob")) {
        console.log("condition true");
        URL.revokeObjectURL(imageUrl);
      }
    };
  }, [image, open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl p-0 overflow-hidden">
        <div className="p-6">
          {/* If editing an existing image */}
          {image?.url ? (
            <>
              <div className="max-h-[72vh] overflow-y-auto space-y-6 pr-2">
                {/* Image Preview */}
                <div className="rounded-lg p-4">
                  <ImageCard
                    image={setUpUrl(image.url)}
                    canvasRef={canvasRef}
                  />
                </div>

                {/* Image Type */}
                <section className="space-y-2">
                  <Label className="text-[13px] font-medium text-gray-700">
                    Image Type
                  </Label>
                  <RadioGroup
                    value={imageType}
                    onValueChange={(val) =>
                      setImageType(val as "Drawing" | "Photo")
                    }
                    className="flex gap-6"
                  >
                    {["Photo", "Drawing"].map((type) => (
                      <label
                        key={type}
                        className="flex cursor-pointer items-center gap-2 text-sm"
                      >
                        <RadioGroupItem value={type} id={type} />
                        {type}
                      </label>
                    ))}
                  </RadioGroup>
                </section>

                {/* Description */}
                <section className="space-y-2">
                  <Label className="text-[13px] font-medium text-gray-700">
                    Description (Optional)
                  </Label>
                  <Textarea
                    placeholder="Add a description for this image..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                    className="resize-none"
                  />
                </section>
              </div>

              {/* Footer */}
              <DialogFooter className="pt-4 border-t mt-4">
                <Button variant="outline" onClick={() => onOpenChange(false)}>
                  Cancel
                </Button>
                <Button loading={loading} onClick={handleSubmit}>
                  Update Image
                </Button>
              </DialogFooter>
            </>
          ) : (
            <>
              <DialogHeader className="mb-4">
                <DialogTitle className="text-lg font-semibold tracking-wide">
                  Add New Image
                </DialogTitle>
              </DialogHeader>

              <div className="max-h-[72vh] overflow-y-auto space-y-6 pr-2">
                {/* Upload Box */}
                <div
                  className={`border-2 border-dashed rounded-lg p-8 text-center transition ${
                    isDragging
                      ? "border-primary bg-primary/5"
                      : "border-gray-300 hover:border-primary/40"
                  }`}
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                >
                  {imageUrl ? (
                    <div className="space-y-4">
                      <div className="rounded-lg p-4">
                        <ImageCard image={imageUrl} canvasRef={canvasRef} />
                      </div>

                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setImageUrl("")}
                      >
                        Change Image
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <Upload className="h-12 w-12 mx-auto text-gray-400" />
                      <p className="text-sm text-gray-500">
                        Drag & drop an image, or click below
                      </p>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => fileInputRef.current?.click()}
                        className="mt-2"
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        Browse Files
                      </Button>
                    </div>
                  )}

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleFileChange(file);
                    }}
                  />
                </div>

                {/* Type */}
                <section className="space-y-2">
                  <Label className="text-[13px] font-medium text-gray-700">
                    Image Type
                  </Label>
                  <RadioGroup
                    value={imageType}
                    onValueChange={(val) =>
                      setImageType(val as "Drawing" | "Photo")
                    }
                    className="flex gap-6"
                  >
                    {["Photo", "Drawing"].map((type) => (
                      <label
                        key={type}
                        className="flex cursor-pointer items-center gap-2 text-sm"
                      >
                        <RadioGroupItem value={type} id={type} />
                        {type}
                      </label>
                    ))}
                  </RadioGroup>
                </section>

                {/* Description */}
                <section className="space-y-2">
                  <Label className="text-[13px] font-medium text-gray-700">
                    Description (Optional)
                  </Label>
                  <Textarea
                    placeholder="Add a description..."
                    rows={3}
                    className="resize-none"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </section>
              </div>

              <DialogFooter className="border-t mt-4 pt-4">
                <Button variant="outline" onClick={() => onOpenChange(false)}>
                  Cancel
                </Button>
                <Button loading={loading} onClick={handleSubmit}>
                  Add Image
                </Button>
              </DialogFooter>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

{
  /* <Button
                      variant="outline"
                      size="sm"
                      onClick={() => cameraInputRef.current?.click()}
                    >
                      <Camera className="h-4 w-4 mr-2" />
                      Take Photo
                    </Button> */
}
