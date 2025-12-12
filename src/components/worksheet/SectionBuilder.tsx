
import { WorksheetSection, WorksheetField, SectionLayout } from '@/types/worksheet.type';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { FieldBuilder } from './FieldBuilder';
import { Plus, Trash2, Grid2X2, Columns2, Columns3, Columns4 } from 'lucide-react';
import { createRandomId } from '@/utils/cryptog';

interface SectionBuilderProps {
  section: WorksheetSection;
  onUpdate: (section: WorksheetSection) => void;
  onDelete: () => void;
}

const LAYOUT_OPTIONS: { value: SectionLayout; label: string; icon: any }[] = [
  { value: 1, label: '1 Column', icon: Grid2X2 },
  { value: 2, label: '2 Columns', icon: Columns2 },
  { value: 3, label: '3 Columns', icon: Columns3 },
  { value: 4, label: '4 Columns', icon: Columns4 },
];

export function SectionBuilder({ section, onUpdate, onDelete }: SectionBuilderProps) {
  const addField = () => {
    const newField: WorksheetField = {
      fieldId: createRandomId("SECTION"),
      name: '',
      type: 'textfield',
      required: false,
      inReport:true
    };
    onUpdate({
      ...section,
      fields: [...section.fields, newField],
    });
  };

  const updateField = (fieldId: string, updatedField: WorksheetField) => {
    onUpdate({
      ...section,
      fields: section.fields.map(f => f.fieldId === fieldId ? updatedField : f),
    });
  };

  const deleteField = (fieldId: string) => {
    onUpdate({
      ...section,
      fields: section.fields.filter(f => f.fieldId !== fieldId),
    });
  };

  return (
    <Card>
      <CardHeader>
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1">
              <Label htmlFor={`section-name-${section.sectionId}`}>Section Name</Label>
              <Input
                id={`section-name-${section.sectionId}`}
                value={section.name}
                onChange={(e) => onUpdate({ ...section, name: e.target.value })}
                placeholder="Enter section name"
                className="mt-2"
              />
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onDelete}
              className="text-destructive"
            >
              <Trash2 className="h-5 w-5" />
            </Button>
          </div>

          <div className="space-y-2">
            <Label>Section Layout</Label>
            <div className="flex gap-2">
              {LAYOUT_OPTIONS.map((layout) => {
                const Icon = layout.icon;
                return (
                  <Button
                    key={layout.value}
                    type="button"
                    variant={section.layout === layout.value ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => onUpdate({ ...section, layout: layout.value })}
                    className="flex-1"
                  >
                    <Icon className="h-4 w-4 mr-2" />
                    {layout.label}
                  </Button>
                );
              })}
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {section.fields.map(field => (
          <FieldBuilder
            key={field.fieldId}
            field={field}
            onUpdate={(updatedField) => updateField(field.fieldId, updatedField)}
            onDelete={() => deleteField(field.fieldId)}
          />
        ))}
        
        <Button
          type="button"
          variant="outline"
          onClick={addField}
          className="w-full"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Field
        </Button>
      </CardContent>
    </Card>
  );
}
