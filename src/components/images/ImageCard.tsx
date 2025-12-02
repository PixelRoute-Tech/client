import { RefObject, useState } from "react";
import { ReactSketchCanvas, ReactSketchCanvasRef } from "react-sketch-canvas";
import { DrawingToolbar } from "./DrawingToolbar";

interface ImageCardProps {
  image: string;
  canvasRef:RefObject<ReactSketchCanvasRef>
}


export const ImageCard = ({ image , canvasRef = null}: ImageCardProps) => {
  const [color, setColor] = useState("#000000");
  const [strokeWidth, setStrokeWidth] = useState(3);
  const [operation,setOperation] = useState<"draw"|"erase">("draw")
  const saveCanvas = async () => {
    if (!canvasRef?.current) return;
    await canvasRef?.current.exportPaths();
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

  const canvasStyle = {
    draw: "border rounded-lg overflow-hidden bg-background mb-3 cursor-crosshair",
    erase: "border rounded-lg overflow-hidden bg-background mb-3 cursor-grab",
  };

  return (
    <div className="">
      <div className="flex flex-col justify-center items-center">

        {/* CANVAS */}
        <div role="button" className={canvasStyle[operation]}>
          <ReactSketchCanvas
            ref={canvasRef}
            style={{height:450,width:400}}
            strokeColor={color}
            backgroundImage={image}
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
      </div>
    </div>
  );
};
