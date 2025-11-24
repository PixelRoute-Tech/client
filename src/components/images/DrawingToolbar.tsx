import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Eraser, Undo2, Redo2, Trash2, Pencil } from 'lucide-react';
import { Slider } from '@/components/ui/slider';

interface DrawingToolbarProps {
  color: string;
  onColorChange: (color: string) => void;
  strokeWidth: number;
  onStrokeWidthChange: (width: number) => void;
  onErase: () => void;
  onUndo: () => void;
  onRedo: () => void;
  onClear: () => void;
  onDraw: () => void;
  isErasing: boolean;
}

export const DrawingToolbar = ({
  color,
  onColorChange,
  strokeWidth,
  onStrokeWidthChange,
  onErase,
  onUndo,
  onRedo,
  onClear,
  onDraw,
  isErasing,
}: DrawingToolbarProps) => {
  return (
    <div className="flex flex-wrap items-center gap-3 p-3 bg-card border rounded-lg">
      <Button
        variant={isErasing ? 'secondary' : 'default'}
        size="sm"
        onClick={onDraw}
        title="Draw"
      >
        <Pencil className="h-4 w-4" />
      </Button>
      
      <Button
        variant={isErasing ? 'default' : 'secondary'}
        size="sm"
        onClick={onErase}
        title="Erase"
      >
        <Eraser className="h-4 w-4" />
      </Button>

      <div className="flex items-center gap-2">
        <Label htmlFor="color" className="text-sm">Color:</Label>
        <Input
          id="color"
          type="color"
          value={color}
          onChange={(e) => onColorChange(e.target.value)}
          className="w-12 h-8 p-1 cursor-pointer"
        />
      </div>

      <div className="flex items-center gap-2 min-w-[150px]">
        <Label className="text-sm whitespace-nowrap">Width:</Label>
        <input
          type="range"
          value={strokeWidth}
          onChange={(e) => onStrokeWidthChange(parseInt(e.target.value))}
          min={1}
          max={20}
          step={1}
          className="flex-1"
        />
        <span className="text-sm w-6">{strokeWidth}</span>
      </div>

      <div className="flex items-center gap-1">
        <Button variant="outline" size="sm" onClick={onUndo} title="Undo">
          <Undo2 className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="sm" onClick={onRedo} title="Redo">
          <Redo2 className="h-4 w-4" />
        </Button>
        <Button variant="destructive" size="sm" onClick={onClear} title="Clear All">
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
