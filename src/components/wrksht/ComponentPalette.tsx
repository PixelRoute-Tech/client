import { Type, ChevronDown, Calendar, CheckSquare, AlignLeft, Table } from "lucide-react";
import { Card } from "@/components/ui/card";
import { FieldType } from "@/types/worksheet";

interface ComponentItem {
  type: FieldType | 'table';
  label: string;
  icon: typeof Type;
}

const components: ComponentItem[] = [
  { type: 'text', label: 'Text Input', icon: Type },
  { type: 'textarea', label: 'Text Area', icon: AlignLeft },
  { type: 'dropdown', label: 'Dropdown', icon: ChevronDown },
  { type: 'date', label: 'Date Picker', icon: Calendar },
  { type: 'checkbox', label: 'Checkbox', icon: CheckSquare },
  { type: 'table', label: 'Table', icon: Table },
];

interface ComponentPaletteProps {
  onAddField: (type: FieldType | 'table') => void;
}

export const ComponentPalette = ({ onAddField }: ComponentPaletteProps) => {
  return (
    <div className="w-64 bg-card border-r border-border p-4 space-y-2">
      <h2 className="text-sm font-semibold text-foreground mb-4">Components</h2>
      {components.map((component) => (
        <Card
          key={component.type}
          className="p-3 cursor-pointer hover:bg-accent hover:border-primary transition-all duration-200"
          onClick={() => onAddField(component.type)}
        >
          <div className="flex items-center gap-3">
            <component.icon className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm text-foreground">{component.label}</span>
          </div>
        </Card>
      ))}
    </div>
  );
};
