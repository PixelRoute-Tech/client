import { Section, ColumnLayout, FieldType } from "@/types/worksheet.type";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { LayoutSelector } from "./LayoutSelector";
import { FieldRenderer } from "./FieldRenderer";
import { TableRenderer } from "./TableRenderer";
import { Button } from "@/components/ui/button";
import { Settings, Trash2 } from "lucide-react";

interface SectionCardProps {
  section: Section;
  onLayoutChange: (layout: ColumnLayout) => void;
  onTitleChange: (title: string) => void;
  onDeleteSection: () => void;
  onConfigureField: (fieldId: string) => void;
}

export const SectionCard = ({
  section,
  onLayoutChange,
  onTitleChange,
  onDeleteSection,
  onConfigureField,
}: SectionCardProps) => {
  const getGridCols = (layout: ColumnLayout) => {
    switch (layout) {
      case 1:
        return "grid-cols-1";
      case 2:
        return "grid-cols-1 md:grid-cols-2";
      case 3:
        return "grid-cols-1 md:grid-cols-2 lg:grid-cols-3";
      case 4:
        return "grid-cols-1 md:grid-cols-2 lg:grid-cols-4";
    }
  };

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between gap-4">
          <Input
            value={section.title}
            onChange={(e) => onTitleChange(e.target.value)}
            className="text-lg font-semibold border-0 px-0 focus-visible:ring-0"
            placeholder="Section Title"
          />
          <Button
            variant="ghost"
            size="icon"
            onClick={onDeleteSection}
            className="text-muted-foreground hover:text-destructive"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>

        <LayoutSelector currentLayout={section.layout} onLayoutChange={onLayoutChange} />

        <div className={`grid ${getGridCols(section.layout)} gap-4`}>
          {section.fields.map((field) => (
            <div key={field.id} className="relative group">
              {field.type === 'table' ? (
                <TableRenderer field={field} />
              ) : (
                <FieldRenderer field={field} />
              )}
              
              {field.type === 'table' && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => onConfigureField(field.id)}
                >
                  <Settings className="w-4 h-4" />
                </Button>
              )}
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};
