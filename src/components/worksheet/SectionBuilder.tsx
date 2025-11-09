import { WorksheetSection, WorksheetField } from '@/types/worksheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { FieldBuilder } from './FieldBuilder';
import { Plus, Trash2 } from 'lucide-react';

interface SectionBuilderProps {
  section: WorksheetSection;
  onUpdate: (section: WorksheetSection) => void;
  onDelete: () => void;
}

export function SectionBuilder({ section, onUpdate, onDelete }: SectionBuilderProps) {
  const addField = () => {
    const newField: WorksheetField = {
      fieldId: crypto.randomUUID(),
      name: '',
      type: 'textfield',
      required: false,
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
