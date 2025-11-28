import { useEffect, useRef, useState } from "react";
import { ReactSketchCanvas, ReactSketchCanvasRef } from "react-sketch-canvas";
import { CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Save } from "lucide-react";

import { baseURL } from "@/config/network.config";
import { DrawingToolbar } from "./DrawingToolbar";
import { ImageRecord } from "@/types/worksheet.type";

interface ImageCardProps {
  image: ImageRecord;
  onDelete?: (id: string) => void;
  onSave?: (file: File, description: string, id: string) => void;
}

export const ImageCard = ({ image, onDelete }: ImageCardProps) => {
  const canvasRef = useRef<ReactSketchCanvasRef>(null);

  const [color, setColor] = useState("#000000");
  const [strokeWidth, setStrokeWidth] = useState(3);
  const [isErasing, setIsErasing] = useState(false);
  const [imageUrl,setImageUrl] = useState<string>("")
  const setUpUrl = (url: string) => {
    return url.startsWith("http") ? url : `${baseURL}${url}`;
  };

  const saveCanvas = async () => {
    if (!canvasRef.current) return;
    await canvasRef.current.exportPaths();
  };

  const handleUndo = async () => {
    await canvasRef.current?.undo();
    saveCanvas();
  };

  const handleRedo = async () => {
    await canvasRef.current?.redo();
    saveCanvas();
  };

  const handleClear = async () => {
    await canvasRef.current?.clearCanvas();
    saveCanvas();
  };

  const handleErase = () => {
    setIsErasing(true);
    canvasRef.current?.eraseMode(true);
  };

  const handleDraw = () => {
    setIsErasing(false);
    canvasRef.current?.eraseMode(false);
  };

  // Convert remote image → Base64
  const fetchImageAsBase64 = async (url: string) => {
    const res = await fetch(url);
    const blob = await res.blob();

    return new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.readAsDataURL(blob);
    });
  };

  const loadImage = async () => {
    if (!canvasRef.current || !image.url) return;

    try {
      const base64 = await fetchImageAsBase64(setUpUrl(image.url));

      // Get canvas container dimensions dynamically
      // const canvasElement = canvasRef.current.canvasContainer;
      // const width = canvasElement?.clientWidth || 600;
      // const height = canvasElement?.clientHeight || 350;
      setImageUrl(base64)
    } catch (err) {
      console.error("Failed to load image", err);
    }
  };

  useEffect(() => {
    loadImage();
  }, [image.url]);

  return (
    <div className="">
      <CardContent className="p-4">
        <div className="mb-3 flex justify-between items-start">
          <div>
            <Badge variant={image.type === "Drawing" ? "default" : "secondary"}>
              {image.type}
            </Badge>
            {image.description && (
              <p className="text-sm text-muted-foreground mt-2">
                {image.description}
              </p>
            )}
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete?.(image._id)}
            className="text-green-500 hover:text-green-400"
          >
            <Save />
          </Button>
        </div>

        {/* CANVAS */}
        <div className="border rounded-lg overflow-hidden bg-background mb-3">
          <ReactSketchCanvas
            ref={canvasRef}
            style={{ width: "100%", height: "40vh" }}
            strokeColor={color}
            backgroundImage={imageUrl}
            strokeWidth={strokeWidth}
            eraserWidth={strokeWidth + 2}
            preserveBackgroundImageAspectRatio="xMidYMid meet"
            onStroke={saveCanvas}
          />
        </div>

        <DrawingToolbar
          color={color}
          onColorChange={setColor}
          strokeWidth={strokeWidth}
          onStrokeWidthChange={setStrokeWidth}
          onErase={handleErase}
          onUndo={handleUndo}
          onRedo={handleRedo}
          onClear={handleClear}
          onDraw={handleDraw}
          isErasing={isErasing}
        />
      </CardContent>
    </div>
  );
};
