import { WorksheetField, FieldType, FieldOption } from '@/types/worksheet.type';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Trash2, Plus } from 'lucide-react';
import { TableBuilder } from './TableBuilder';
import { createRandomId } from '@/utils/cryptog';

interface FieldBuilderProps {
  field: WorksheetField;
  onUpdate: (field: WorksheetField) => void;
  onDelete: () => void;
}

const FIELD_TYPES: { value: FieldType; label: string }[] = [
  { value: 'textfield', label: 'Text Field' },
  { value: 'checkbox', label: 'Checkbox' },
  { value: 'radio', label: 'Radio Button' },
  { value: 'textarea', label: 'Text Area' },
  { value: 'select', label: 'Select Box' },
  { value: 'autocomplete', label: 'Autocomplete' },
  { value: 'autocomplete-chips', label: 'Autocomplete with Chips' },
  { value: 'file', label: 'Files Field' },
  { value: 'table', label: 'Table' },
];

const TYPES_WITH_OPTIONS: FieldType[] = ['radio', 'select', 'autocomplete', 'autocomplete-chips'];

export function FieldBuilder({ field, onUpdate, onDelete }: FieldBuilderProps) {
  const showOptions = TYPES_WITH_OPTIONS.includes(field.type);
  const isTable = field.type === 'table';

  const addOption = () => {
    const newOption: FieldOption = {
      optionId: createRandomId("OPTION"),
      value: '',
    };
    onUpdate({
      ...field,
      options: [...(field.options || []), newOption],
    });
  };

  const updateOption = (optionId: string, value: string) => {
    onUpdate({
      ...field,
      options: field.options?.map(opt => 
        opt.optionId === optionId ? { ...opt, value } : opt
      ),
    });
  };

  const deleteOption = (optionId: string) => {
    onUpdate({
      ...field,
      options: field.options?.filter(opt => opt.optionId !== optionId),
    });
  };

  return (
    <div className="border rounded-lg p-4 space-y-4 bg-card">
      <div className="flex justify-between items-start gap-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 flex-1">
          <div className="space-y-2">
            <Label htmlFor={`field-name-${field.fieldId}`}>Field Name</Label>
            <Input
              id={`field-name-${field.fieldId}`}
              value={field.name}
              onChange={(e) => onUpdate({ ...field, name: e.target.value })}
              placeholder="Enter field name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor={`field-type-${field.fieldId}`}>Field Type</Label>
            <Select
              value={field.type}
              onValueChange={(value: FieldType) => onUpdate({ ...field, type: value })}
            >
              <SelectTrigger id={`field-type-${field.fieldId}`}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {FIELD_TYPES.map(type => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-end space-x-3">
            <div className="flex items-center space-x-2">
              <Checkbox
                id={`field-required-${field.fieldId}`}
                checked={field.required}
                onCheckedChange={(checked) => 
                  onUpdate({ ...field, required: checked as boolean })
                }
              />
              <Label htmlFor={`field-required-${field.fieldId}`}>Is Required</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id={`field-inreport-${field.fieldId}`}
                checked={field.inReport}
                onCheckedChange={(checked) => 
                  onUpdate({ ...field, inReport: checked as boolean })
                }
              />
              <Label htmlFor={`field-inreport-${field.fieldId}`}>In Report</Label>
            </div>
          </div>
        </div>

        <Button
          variant="ghost"
          size="icon"
          onClick={onDelete}
          className="text-destructive"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>

      {showOptions && (
        <div className="space-y-2 pl-4 border-l-2 border-muted">
          <div className="flex items-center justify-between">
            <Label>Field Options</Label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addOption}
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Option
            </Button>
          </div>
          
          <div className="space-y-2">
            {field.options?.map((option, index) => (
              <div key={option.optionId} className="flex items-center gap-2">
                <Input
                  value={option.value}
                  onChange={(e) => updateOption(option.optionId, e.target.value)}
                  placeholder={`Option ${index + 1}`}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => deleteOption(option.optionId)}
                  className="text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {isTable && (
        <div className="pl-4 border-l-2 border-muted">
          <TableBuilder
            columns={field.tableColumns || []}
            actions={field.tableActions || { edit: false, view: false, delete: false }}
            onUpdate={(columns, actions) => 
              onUpdate({ ...field, tableColumns: columns, tableActions: actions })
            }
          />
        </div>
      )}
    </div>
  );
}