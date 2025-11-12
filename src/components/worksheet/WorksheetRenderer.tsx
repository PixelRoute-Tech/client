import { useState } from 'react';
import { Worksheet, WorksheetField, TableColumn } from '@/types/worksheet';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { X, Plus, Edit, Eye, Trash2 } from 'lucide-react';

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
              const target = e.target as HTMLInputElement;
              const file = target.files?.[0];
              if (file) {
                handleFieldChange(field.id, file.name);
              }
            }}
            required={field.required}
          />
        );

      case 'table':
        return renderTable(field);

      default:
        return null;
    }
  };

  const renderTableCell = (
    column: TableColumn,
    rowIndex: number,
    fieldId: string,
    columnId: string
  ) => {
    const tableData = formData[fieldId] || [];
    const cellValue = tableData[rowIndex]?.[columnId];

    const handleCellChange = (value: any) => {
      const newTableData = [...tableData];
      if (!newTableData[rowIndex]) {
        newTableData[rowIndex] = {};
      }
      newTableData[rowIndex][columnId] = value;
      handleFieldChange(fieldId, newTableData);
    };

    switch (column.type) {
      case 'textfield':
        return (
          <Input
            value={cellValue || ''}
            onChange={(e) => handleCellChange(e.target.value)}
          />
        );

      case 'textarea':
        return (
          <Textarea
            value={cellValue || ''}
            onChange={(e) => handleCellChange(e.target.value)}
            rows={2}
          />
        );

      case 'select':
        return (
          <Select
            value={cellValue || ''}
            onValueChange={handleCellChange}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              {column.options?.map((option) => (
                <SelectItem key={option.id} value={option.value}>
                  {option.value}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      case 'checkbox':
        return (
          <Checkbox
            checked={cellValue || false}
            onCheckedChange={handleCellChange}
          />
        );

      default:
        return null;
    }
  };

  const renderTable = (field: WorksheetField) => {
    const tableData = (formData[field.id] || []) as any[];
    const columns = field.tableColumns || [];
    const actions = field.tableActions || { edit: false, view: false, delete: false };
    const hasActions = actions.edit || actions.view || actions.delete;

    const addRow = () => {
      const newRow: any = {};
      columns.forEach(col => {
        newRow[col.id] = '';
      });
      handleFieldChange(field.id, [...tableData, newRow]);
    };

    const deleteRow = (rowIndex: number) => {
      const newTableData = tableData.filter((_, idx) => idx !== rowIndex);
      handleFieldChange(field.id, newTableData);
    };

    return (
      <div className="space-y-4">
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                {columns.map((column) => (
                  <TableHead key={column.id}>{column.name}</TableHead>
                ))}
                {hasActions && <TableHead className="text-right">Actions</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {tableData.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={columns.length + (hasActions ? 1 : 0)}
                    className="text-center text-muted-foreground py-8"
                  >
                    No rows added yet. Click "Add Row" to get started.
                  </TableCell>
                </TableRow>
              ) : (
                tableData.map((_, rowIndex) => (
                  <TableRow key={rowIndex}>
                    {columns.map((column) => (
                      <TableCell key={column.id}>
                        {renderTableCell(column, rowIndex, field.id, column.id)}
                      </TableCell>
                    ))}
                    {hasActions && (
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          {actions.view && (
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                          )}
                          {actions.edit && (
                            <Button variant="ghost" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                          )}
                          {actions.delete && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => deleteRow(rowIndex)}
                              className="text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    )}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
        <Button type="button" variant="outline" size="sm" onClick={addRow}>
          <Plus className="h-4 w-4 mr-2" />
          Add Row
        </Button>
      </div>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-primary">{worksheet.name}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {worksheet.sections.map((section) => {
          // Default to 1 column layout for backward compatibility
          const layout = section.layout || 1;
          const gridCols = {
            1: 'grid-cols-1',
            2: 'grid-cols-1 md:grid-cols-2',
            3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
            4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
          };

          return (
            <div key={section.id} className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground border-b pb-2">
                {section.name}
              </h3>
              <div className={`grid gap-4 ${gridCols[layout]}`}>
                {section.fields.map((field) => (
                  <div
                    key={field.id}
                    className={`space-y-2 ${field.type === 'table' ? 'col-span-full' : ''}`}
                  >
                    <Label>
                      {field.name}
                      {field.required && <span className="text-destructive ml-1">*</span>}
                    </Label>
                    {renderField(field)}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
