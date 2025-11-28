import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ImageUploadModal } from "@/components/images/ImageUploadModal";
import { ImageCard } from "@/components/images/ImageCard";
import { imageStorage } from "@/utils/imageStorage";
import { useToast } from "@/hooks/use-toast";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { ArrowLeft, Pencil, Trash2, Plus } from "lucide-react";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  getImageRecordImages,
  uploadRecordImage,
} from "@/services/worksheet.services";
import { ImageRecord } from "@/types/worksheet.type";
import { baseURL } from "@/config/network.config";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function ReportImageUpload() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const sheetName = searchParams.get("worksheet");
  const worksheetId = searchParams.get("worksheetid");
  const jobId = searchParams.get("jobid");
  const clientName = searchParams.get("clientname");
  const [editImage,setEditImage] = useState<ImageRecord | null>(null)
  const { data: images, refetch } = useQuery({
    queryKey: [`${id}photosforworksheet`, id],
    queryFn: async () => getImageRecordImages(id),
    refetchOnWindowFocus: false,
  });

  const { mutate: save, isPending: saveLoading } = useMutation({
    mutationFn: uploadRecordImage,
    onSuccess: (result) => {
      console.log(result);
      if (result.success) {
        refetch();
        toast({
          title: "Upload success",
          description: result.message,
          className: "bg-green-500 text-white",
        });
      } else {
        toast({
          title: "Failed to upload",
          description: result.message,
          className: "bg-red-500 text-white",
        });
      }
    },
    onError: (e: any) => {
      toast({
        title: "Error",
        description: e.message || "Oops! something went wrong",
        className: "bg-red-500 text-white",
      });
    },
  });

  const handleUpload = (
    file: File,
    type: "Drawing" | "Photo",
    description: string
  ) => {
    const formData = new FormData();
    if (typeof file == "string") {
      formData.append("file", null);
      formData.append("imageUrl", file);
    }
    formData.append("file", file);
    formData.append("type", type);
    formData.append("recordId", id);
    formData.append("description", description);
    formData.append("worksheetId", worksheetId);
    formData.append("jobId", jobId);
    save(formData);
  };

  const handleDelete = (id: string) => {
    imageStorage.delete(id);
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
          <div className="flex gap-2">
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
        <h5 className="text-center">
          {sheetName} ({clientName})
        </h5>
        {images?.data?.length === 0 ? (
          <div className="text-center py-12 border-2 border-dashed rounded-lg">
            <p className="text-muted-foreground mb-4">No images yet</p>
            <Button onClick={() => setIsModalOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Image
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2 space-y-4 px-5">
            {images?.data?.map((image) => (
              <Card className="" id={image._id}>
                <CardContent className="p-4">
                  <div className="mb-3 flex justify-between items-start">
                    <div>
                      <Badge
                        variant={
                          image.type === "Drawing" ? "default" : "secondary"
                        }
                      >
                        {image.type}
                      </Badge>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {setIsModalOpen(true),setEditImage(image)}}
                        className="text-green-500 hover:text-green-400"
                      >
                        <Pencil />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {}}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* CANVAS WITH IMAGE BACKGROUND */}
                  <div className="border rounded-lg overflow-hidden bg-background mb-3">
                    <img src={image.url} />
                  </div>
                  {image.description && (
                    <p className="text-sm text-muted-foreground mt-2">
                      {image.description}
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <ImageUploadModal
          loading={saveLoading}
          image={editImage}
          open={isModalOpen || saveLoading}
          onOpenChange={setIsModalOpen}
          onUpload={handleUpload}
        />
      </div>
    </>
  );
}
