import { ColumnLayout } from "@/types/worksheet";
import { Button } from "@/components/ui/button";
import { Columns2, Columns3, Columns4, RectangleVertical } from "lucide-react";

interface LayoutSelectorProps {
  currentLayout: ColumnLayout;
  onLayoutChange: (layout: ColumnLayout) => void;
}

export const LayoutSelector = ({ currentLayout, onLayoutChange }: LayoutSelectorProps) => {
  const layouts: { value: ColumnLayout; icon: typeof RectangleVertical; label: string }[] = [
    { value: 1, icon: RectangleVertical, label: '1 Column' },
    { value: 2, icon: Columns2, label: '2 Columns' },
    { value: 3, icon: Columns3, label: '3 Columns' },
    { value: 4, icon: Columns4, label: '4 Columns' },
  ];

  return (
    <div className="flex items-center gap-2 p-2 bg-muted rounded-lg">
      <span className="text-xs font-medium text-muted-foreground mr-2">Layout:</span>
      {layouts.map(({ value, icon: Icon, label }) => (
        <Button
          key={value}
          variant={currentLayout === value ? "default" : "ghost"}
          size="sm"
          onClick={() => onLayoutChange(value)}
          className="h-8 px-3"
          title={label}
        >
          <Icon className="w-4 h-4" />
        </Button>
      ))}
    </div>
  );
};
