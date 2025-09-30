import { useState } from 'react';
import { Worksheet, WorksheetField } from '@/types/worksheet';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';

export type WorksheetData = {
  [fieldId: string]: any;
};

interface WorksheetRendererProps {
  worksheet: Worksheet;
  data?: WorksheetData;
  onChange: (data: WorksheetData) => void;
}

export function WorksheetRenderer({ worksheet, data = {}, onChange }: WorksheetRendererProps) {
  const [formData, setFormData] = useState<WorksheetData>(data);

  const handleFieldChange = (fieldId: string, value: any) => {
    const newData = { ...formData, [fieldId]: value };
    setFormData(newData);
    onChange(newData);
  };

  const renderField = (field: WorksheetField) => {
    const value = formData[field.id];

    switch (field.type) {
      case 'textfield':
        return (
          <Input
            value={value || ''}
            onChange={(e) => handleFieldChange(field.id, e.target.value)}
            placeholder={`Enter ${field.name}`}
            required={field.required}
          />
        );

      case 'textarea':
        return (
          <Textarea
            value={value || ''}
            onChange={(e) => handleFieldChange(field.id, e.target.value)}
            placeholder={`Enter ${field.name}`}
            required={field.required}
          />
        );

      case 'checkbox':
        return (
          <div className="flex items-center gap-2">
            <Checkbox
              checked={value || false}
              onCheckedChange={(checked) => handleFieldChange(field.id, checked)}
              required={field.required}
            />
            <Label>{field.name}</Label>
          </div>
        );

      case 'radio':
        return (
          <RadioGroup
            value={value || ''}
            onValueChange={(val) => handleFieldChange(field.id, val)}
            required={field.required}
          >
            {field.options?.map((option) => (
              <div key={option.id} className="flex items-center gap-2">
                <RadioGroupItem value={option.value} id={`${field.id}-${option.id}`} />
                <Label htmlFor={`${field.id}-${option.id}`}>{option.value}</Label>
              </div>
            ))}
          </RadioGroup>
        );

      case 'select':
        return (
          <Select
            value={value || ''}
            onValueChange={(val) => handleFieldChange(field.id, val)}
            required={field.required}
          >
            <SelectTrigger>
              <SelectValue placeholder={`Select ${field.name}`} />
            </SelectTrigger>
            <SelectContent>
              {field.options?.map((option) => (
                <SelectItem key={option.id} value={option.value}>
                  {option.value}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      case 'autocomplete':
        return (
          <Select
            value={value || ''}
            onValueChange={(val) => handleFieldChange(field.id, val)}
            required={field.required}
          >
            <SelectTrigger>
              <SelectValue placeholder={`Select ${field.name}`} />
            </SelectTrigger>
            <SelectContent>
              {field.options?.map((option) => (
                <SelectItem key={option.id} value={option.value}>
                  {option.value}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      case 'autocomplete-chips':
        const chipValues = value || [];
        return (
          <div className="space-y-2">
            <Select
              onValueChange={(val) => {
                if (!chipValues.includes(val)) {
                  handleFieldChange(field.id, [...chipValues, val]);
                }
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder={`Select ${field.name}`} />
              </SelectTrigger>
              <SelectContent>
                {field.options?.map((option) => (
                  <SelectItem key={option.id} value={option.value}>
                    {option.value}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {chipValues.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {chipValues.map((chip: string, idx: number) => (
                  <Badge key={idx} variant="secondary" className="gap-1">
                    {chip}
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() =>
                        handleFieldChange(
                          field.id,
                          chipValues.filter((_: string, i: number) => i !== idx)
                        )
                      }
                    />
                  </Badge>
                ))}
              </div>
            )}
          </div>
        );

      case 'file':
        return (
          <Input
            type="file"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                handleFieldChange(field.id, file.name);
              }
            }}
            required={field.required}
          />
        );

      default:
        return null;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-primary">{worksheet.name}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {worksheet.sections.map((section) => (
          <div key={section.id} className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground border-b pb-2">
              {section.name}
            </h3>
            <div className="space-y-4">
              {section.fields.map((field) => (
                <div key={field.id} className="space-y-2">
                  <Label>
                    {field.name}
                    {field.required && <span className="text-destructive ml-1">*</span>}
                  </Label>
                  {renderField(field)}
                </div>
              ))}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
