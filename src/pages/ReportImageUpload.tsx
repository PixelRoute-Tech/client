import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  ImageUploadModal,
  OnUploadParams,
} from "@/components/images/ImageUploadModal";
import { ImageCard } from "@/components/images/ImageCard";
import { imageStorage } from "@/utils/imageStorage";
import { useToast } from "@/hooks/use-toast";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { ArrowLeft, Pencil, Trash2, Plus } from "lucide-react";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  deleteRecordImage,
  getImageRecordImages,
  updateRecordImage,
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
  const [editImage, setEditImage] = useState<ImageRecord | null>(null);
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

  const { mutate: update, isPending: updateLoading } = useMutation({
    mutationFn: updateRecordImage,
    onSuccess: (result) => {
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

  const { mutate: deleteFile, isPending: deleteLoading } = useMutation({
    mutationFn: deleteRecordImage,
    onSuccess: (result) => {
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

  const handleUpload = ({
    description,
    preview,
    file,
    path,
    type,
  }: OnUploadParams) => {
    const formData = new FormData();

    formData.append("preview", preview);
    formData.append("imagePath", JSON.stringify(path, null, 2));
    formData.append("type", type);
    formData.append("recordId", id);
    formData.append("description", description);
    formData.append("worksheetId", worksheetId);
    formData.append("jobId", jobId);
    formData.get("preview");
    if (editImage) {
      if (file) {
        formData.append("previousFilePath", editImage.url);
      }
      if (preview) {
        formData.append("previousPreviewPath", editImage.preview);
      }
      formData.append("filename", editImage.fileName || null);
      formData.append("id", editImage._id);
      update(formData);
    } else {
      formData.append("file", file);
      save(formData);
    }
  };

  const handleDelete = (image: ImageRecord) => {
    deleteFile({ id: image._id, imageUrl: image.url, preview: image.preview });
  };

  const handleEditImage = (image: ImageRecord) => {
    setIsModalOpen(true), setEditImage(image);
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
          <Button
            onClick={() => {
              setIsModalOpen(true), setEditImage(null);
            }}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Image
          </Button>
        </div>
        <h5 className="text-center">
          {sheetName} ({clientName})
        </h5>
        {!Boolean(images?.data?.length) ? (
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
              <Card key={image?._id} className="" id={image._id}>
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
                        loading={deleteLoading}
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditImage(image)}
                        className="text-green-500 hover:text-green-400"
                      >
                        <Pencil />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          handleDelete(image);
                        }}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* CANVAS WITH IMAGE BACKGROUND */}
                  <div className="border rounded-lg overflow-hidden bg-background mb-3">
                    <img
                      className="w-full h-[50vh] object-contain rounded-md"
                      src={`${baseURL}${image.preview}`}
                    />
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
          loading={saveLoading || updateLoading}
          image={editImage}
          open={isModalOpen || saveLoading || updateLoading}
          onOpenChange={setIsModalOpen}
          onUpload={handleUpload}
        />
      </div>
    </>
  );
}
