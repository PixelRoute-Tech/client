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

export const dimension = {
  height: 300,
  width: 350,
};

export const ImageCard = ({ image, onDelete }: ImageCardProps) => {
  const canvasRef = useRef<ReactSketchCanvasRef>(null);

  const [color, setColor] = useState("#000000");
  const [strokeWidth, setStrokeWidth] = useState(3);
  const [operation, setOperation] = useState<"draw" | "erase">("draw");
  const [imageUrl, setImageUrl] = useState<string>("");
  const setUpUrl = () => {
    const imgurl = image.url.startsWith("http") ? image.url : `${baseURL}${image.url}`;
    setImageUrl(imgurl)
    return imgurl
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
    setOperation("erase");
    canvasRef.current?.eraseMode(true);
  };

  const handleDraw = () => {
    setOperation("draw");
    canvasRef.current?.eraseMode(false);
  };

  // Convert remote image → Base64
  // const handleImageResizeFromUrl = () => {
  //   const img = new Image();
  //   img.crossOrigin = "anonymous"; // Allow cross-origin requests

  //   img.src = setUpUrl(image.url)
  //   const splitedEtx = image.url.split(".")
  //   const ext = splitedEtx[splitedEtx.length - 1]
  //  console.log("image src = ",img.src,"extention = ",ext)
  //   img.onload = () => {
  //     const canvas = document.createElement("canvas");
  //     const ctx = canvas.getContext("2d");
  //     canvas.width = dimension.width;
  //     canvas.height = dimension.height;

  //     if (ctx) {
  //       ctx.drawImage(img, 0, 0, dimension.width, dimension.width);
  //       canvas.toBlob(
  //         (blob) => {
  //           if (blob) {
  //             const resizedUrl = URL.createObjectURL(blob);
  //             console.log(resizedUrl);
  //             setImageUrl(resizedUrl);
  //           }
  //         },
  //         `image/${ext}`,
  //         0.8
  //       );
  //     }
  //   };

  //   img.onerror = () => {
  //     console.error("Failed to load image from URL.");
  //   };
  // };

  const canvasStyle = {
    draw: "border rounded-lg overflow-hidden bg-background mb-3 cursor-pen",
    erase: "border rounded-lg overflow-hidden bg-background mb-3 cursor-erase",
  };

  const handleSave = async () => {
    const paths = await canvasRef.current.exportPaths();
    console.log(paths);
    let allPath = JSON.parse(localStorage.getItem("imagePath") || "{}")
        console.log("allPath = ",allPath);
    if(allPath[image._id]){
      allPath[image._id] = paths;
    }else{
      allPath = {...allPath,[image._id]:paths} 
    }
    localStorage.setItem("imagePath", JSON.stringify(allPath));
  };

  const loadPath = async ()=>{
      try {
         const pathData = await fetch("http://localhost:8000/uploads/drawPaths/imgpathone.json")
         const pathjson =await pathData.json()
         console.log("pathjson = ",pathjson)
         canvasRef.current.loadPaths(pathjson)
      } catch (error) {
        console.log("error",error)
      }
  }

  useEffect(() => {
    // handleImageResizeFromUrl();
    loadPath()
    setUpUrl()
  }, [image.url]);

  return (
    <div className="">
      <CardContent className="">
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
            onClick={handleSave}
            className="text-green-500 hover:text-green-400"
          >
            <Save />
          </Button>
        </div>

        {/* CANVAS */}
        <div className={canvasStyle[operation]}>
          <ReactSketchCanvas
            ref={canvasRef}
            style={dimension}
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
          isErasing={operation == "erase"}
        />
      </CardContent>
    </div>
  );
};
