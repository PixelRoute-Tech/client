import { useEffect, useRef, useState } from "react";
import { ReactSketchCanvas, ReactSketchCanvasRef } from "react-sketch-canvas";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Save, Trash2 } from "lucide-react";
import { DrawingToolbar } from "./DrawingToolbar";

import { imageStorage } from "@/utils/imageStorage";
import { ImageRecord } from "@/types/worksheet.type";

interface ImageCardProps {
  image: ImageRecord;
  onDelete: (id: string) => void;
  onSave?:(file:File,description:string,id:string)=>void
}

export const ImageCard = ({ image, onDelete }: ImageCardProps) => {
  const canvasRef = useRef<ReactSketchCanvasRef>(null);

  const [color, setColor] = useState("#000000");
  const [strokeWidth, setStrokeWidth] = useState(3);
  const [isErasing, setIsErasing] = useState(false);

  // Load saved drawing data when component mounts
  useEffect(() => {
    if (canvasRef.current && image.url) {
      try {
        canvasRef.current.loadPaths(JSON.parse(image.url));
      } catch (err) {
        console.error("Failed to load canvas data", err);
      }
    }
  }, [image.url]);

  const saveCanvas = async () => {
    if (!canvasRef.current) return;
    const paths = await canvasRef.current.exportPaths();
  };

  const handleUndo = async () => {
    await canvasRef.current?.undo();
    await saveCanvas();
  };

  const handleRedo = async () => {
    await canvasRef.current?.redo();
    await saveCanvas();
  };

  const handleClear = async () => {
    await canvasRef.current?.clearCanvas();
    await saveCanvas();
  };

  const handleErase = () => {
    setIsErasing(true);
    canvasRef.current?.eraseMode(true);
  };

  const handleDraw = () => {
    setIsErasing(false);
    canvasRef.current?.eraseMode(false);
  };

  return (
    <Card className="overflow-hidden">
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
          <div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(image._id)}
              className="text-destructive hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(image._id)}
              className="text-green-500 hover:text-green-400"
            >
              <Save />
            </Button>
          </div>
        </div>

        {/* CANVAS WITH IMAGE BACKGROUND */}
        <div className="border rounded-lg overflow-hidden bg-background mb-3">
          <ReactSketchCanvas
            ref={canvasRef}
            style={{
              width: "100%",
              height: "40vh",
            }}
            strokeColor={color}
            strokeWidth={strokeWidth}
            eraserWidth={strokeWidth + 2}
            backgroundImage={image.url}
            preserveBackgroundImageAspectRatio="xMidYMid meet"
            onStroke={() => saveCanvas()}
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
    </Card>
  );
};
