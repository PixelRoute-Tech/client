import { useEffect, useRef, useState } from 'react';
import { Canvas as FabricCanvas ,Image} from 'fabric';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trash2 } from 'lucide-react';
import { DrawingToolbar } from './DrawingToolbar';
import { ImageData } from '@/types/image';
import { imageStorage } from '@/utils/imageStorage';

interface ImageCardProps {
  image: ImageData;
  onDelete: (id: string) => void;
}

export const ImageCard = ({ image, onDelete }: ImageCardProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [fabricCanvas, setFabricCanvas] = useState<FabricCanvas | null>(null);
  const [color, setColor] = useState('#000000');
  const [strokeWidth, setStrokeWidth] = useState(3);
  const [isErasing, setIsErasing] = useState(false);
  const [history, setHistory] = useState<string[]>([]);
  const [historyStep, setHistoryStep] = useState(-1);
// useEffect(() => {
//   if (!canvasRef.current) return;

//   const canvas = new FabricCanvas(canvasRef.current, {
//     width: 400,
//     height: 300,
//     isDrawingMode: true,
//   });

//   Image.fromURL(image.url, (img) => {
//     if (!img) return;

//     const scale = Math.min(400 / img.width!, 300 / img.height!);

//     img.scale(scale);
//     canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas));

//     // Restore saved drawings if any
//     if (image.canvasData) {
//       canvas.loadFromJSON(image.canvasData, () => {
//         canvas.renderAll();
//         saveToHistory(canvas);
//       });
//     } else {
//       saveToHistory(canvas);
//     }
//   }, { crossOrigin: "anonymous" });

//   if (canvas.freeDrawingBrush) {
//     canvas.freeDrawingBrush.color = color;
//     canvas.freeDrawingBrush.width = strokeWidth;
//   }

//   canvas.on("path:created", () => {
//     saveToHistory(canvas);
//     saveCanvas(canvas);
//   });

//   setFabricCanvas(canvas);

//   return () => canvas.dispose();
// }, [image.url]);

  useEffect(() => {
    if (!fabricCanvas || !fabricCanvas.freeDrawingBrush) return;
    fabricCanvas.freeDrawingBrush.color = isErasing ? '#FFFFFF' : color;
    fabricCanvas.freeDrawingBrush.width = strokeWidth;
  }, [color, strokeWidth, isErasing, fabricCanvas]);

  const saveToHistory = (canvas: FabricCanvas) => {
    const json = JSON.stringify(canvas.toJSON());
    setHistory(prev => {
      const newHistory = prev.slice(0, historyStep + 1);
      newHistory.push(json);
      return newHistory;
    });
    setHistoryStep(prev => prev + 1);
  };

  const saveCanvas = (canvas: FabricCanvas) => {
    const json = JSON.stringify(canvas.toJSON());
    imageStorage.update(image.id, { canvasData: json });
  };

  const handleUndo = () => {
    if (historyStep > 0 && fabricCanvas) {
      const newStep = historyStep - 1;
      setHistoryStep(newStep);
      fabricCanvas.loadFromJSON(history[newStep], () => {
        fabricCanvas.renderAll();
        saveCanvas(fabricCanvas);
      });
    }
  };

  const handleRedo = () => {
    if (historyStep < history.length - 1 && fabricCanvas) {
      const newStep = historyStep + 1;
      setHistoryStep(newStep);
      fabricCanvas.loadFromJSON(history[newStep], () => {
        fabricCanvas.renderAll();
        saveCanvas(fabricCanvas);
      });
    }
  };

  const handleClear = () => {
    if (!fabricCanvas) return;
    fabricCanvas.getObjects().forEach(obj => {
      if (obj.type === 'path') {
        fabricCanvas.remove(obj);
      }
    });
    fabricCanvas.renderAll();
    saveToHistory(fabricCanvas);
    saveCanvas(fabricCanvas);
  };

  const handleErase = () => {
    setIsErasing(true);
  };

  const handleDraw = () => {
    setIsErasing(false);
  };

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-4">
        <div className="mb-3 flex justify-between items-start">
          <div>
            <Badge variant={image.type === 'Drawing' ? 'default' : 'secondary'}>
              {image.type}
            </Badge>
            {image.description && (
              <p className="text-sm text-muted-foreground mt-2">{image.description}</p>
            )}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(image.id)}
            className="text-destructive hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="border rounded-lg overflow-hidden bg-background mb-3">
         {/* <canvas ref={canvasRef} className="w-full h-auto" /> */}
         <img className="w-full h-[40vh] object-contain" src={image.url} />
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
