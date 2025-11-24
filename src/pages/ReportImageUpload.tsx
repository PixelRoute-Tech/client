import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { ImageUploadModal } from "@/components/images/ImageUploadModal";
import { ImageCard } from "@/components/images/ImageCard";
import { imageStorage } from "@/utils/imageStorage";
import { ImageData } from "@/types/image";
import { Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function ReportImageUpload() {
  const [images, setImages] = useState<ImageData[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
const [searchParams] = useSearchParams();
const sheetName = searchParams.get("worksheet");
  useEffect(() => {
    loadImages();
  }, []);

  const loadImages = () => {
    const loadedImages = imageStorage.getAll();
    setImages(loadedImages);
  };

  const handleUpload = (
    imageUrl: string,
    type: "Drawing" | "Photo",
    description: string
  ) => {
    imageStorage.save({
      url: imageUrl,
      type,
      description,
    });
    loadImages();
  };

  const handleDelete = (id: string) => {
    imageStorage.delete(id);
    loadImages();
    toast({
      title: "Image deleted",
      description: "The image has been removed",
    });
  };

  return (
    <>
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <Button
            variant="outline"
            onClick={() => navigate(-1)}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <div>
            <h5 className="font-bold"> Photographs</h5>
            {/* <p className="text-muted-foreground mt-1">
              Upload images and draw on them with powerful tools
            </p> */}
          </div>
          <Button onClick={() => setIsModalOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Image
          </Button>
        </div>

        {images.length === 0 ? (
          <div className="text-center py-12 border-2 border-dashed rounded-lg">
            <p className="text-muted-foreground mb-4">No images yet</p>
            <Button onClick={() => setIsModalOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Image
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-2 space-y-4 px-5">
            {images.map((image) => (
              <ImageCard key={image.id} image={image} onDelete={handleDelete} />
            ))}
          </div>
        )}

        <ImageUploadModal
          open={isModalOpen}
          onOpenChange={setIsModalOpen}
          onUpload={handleUpload}
        />
      </div>
    </>
  );
}
