import { useState, useEffect } from "react";
import { Worksheet, WorksheetField, TableColumn } from "@/types/worksheet.type";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  X,
  Plus,
  Edit,
  Eye,
  Trash2,
  Save,
  RotateCcw,
  ArrowLeft,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { worksheetDataStorage } from "@/utils/worksheetDataStorage";
import { useMutation } from "@tanstack/react-query";
import { saveRecord, updateRecord } from "@/services/worksheet.services";
import { useNavigate } from "react-router-dom";
export type WorksheetData = {
  [fieldId: string]: any;
};

interface WorksheetRendererProps {
  worksheet: Worksheet;
  data?: WorksheetData;
  onChange?: (data: WorksheetData) => void;
  onSubmit?: (data: WorksheetData) => void;
  recordId?: string;
  clientId?: string;
}

export function WorksheetRenderer({
  worksheet,
  data = {},
  onChange,
  onSubmit,
  recordId,
  clientId = "",
}: WorksheetRendererProps) {
  const [formData, setFormData] = useState<WorksheetData>(data);
  const [currentRecordId, setCurrentRecordId] = useState<string>(
    recordId || ""
  );
  const { toast } = useToast();
  const navigate = useNavigate();
  // useEffect(() => {
  //   if (recordId) {
  //     const record = worksheetDataStorage.getById(recordId);
  //     if (record) {
  //       setFormData(record.data);
  //     }
  //   }
  // }, [recordId]);

  const { mutate: save, isLoading: saveLoading } = useMutation({
    mutationFn: saveRecord,
    onSuccess: (result) => {
      toast({
        title: "Success",
        description: result?.message,
        className: "bg-green-500 text-white",
      });
    },
    onError: (error: any) => {
      toast({
        title: "error",
        description: error?.message || "Something went wrong",
        className: "bg-red-500 text-white",
      });
    },
  });
  const { mutate: update, isLoading: updateLoading } = useMutation({
    mutationFn: updateRecord,
    onSuccess: (result) => {
      toast({
        title: "Success",
        description: result?.message,
        className: "bg-green-500 text-white",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error?.message || "Something went wrong",
        className: "bg-red-500 text-white",
      });
    },
  });

  const handleFieldChange = (fieldId: string, value: any) => {
    const newData = { ...formData, [fieldId]: value };
    setFormData(newData);
    onChange?.(newData);
  };

  const handleSave = () => {
    const jobId = recordId.split("_")[1];
    const record = {
      jobId,
      recordId,
      clientId,
      worksheetId: worksheet.workSheetId,
      data: formData,
    };
    onSubmit && onSubmit(record);
    setCurrentRecordId(recordId);
    if (Object.entries(data).length > 0) {
      update(record);
    } else {
      save(record);
    }
  };

  const handleReset = () => {
      setFormData({});
    // setCurrentRecordId("");
    onChange?.({});
    toast({
      title: "Reset Complete",
      description: "Form has been cleared",
    });
  };

  useEffect(()=>{
    if(Object.entries(data).length > 0){
       setFormData(data)
    }
  },[data])

  const renderField = (field: WorksheetField) => {
    const value = formData[field.fieldId];
    switch (field.type) {
      case "textfield":
        return (
          <Input
            value={value || ""}
            onChange={(e) => handleFieldChange(field.fieldId, e.target.value)}
            placeholder={`Enter ${field.name}`}
            required={field.required}
          />
        );

      case "textarea":
        return (
          <Textarea
            value={value || ""}
            onChange={(e) => handleFieldChange(field.fieldId, e.target.value)}
            placeholder={`Enter ${field.name}`}
            required={field.required}
          />
        );

      case "checkbox":
        return (
          <div className="flex items-center gap-2">
            <Checkbox
              checked={value || false}
              onCheckedChange={(checked) =>
                handleFieldChange(field.fieldId, checked)
              }
              required={field.required}
            />
            <Label>{field.name}</Label>
          </div>
        );

      case "radio":
        return (
          <RadioGroup
            value={value || ""}
            onValueChange={(val) => handleFieldChange(field.fieldId, val)}
            required={field.required}
          >
            {field.options?.map((option) => (
              <div key={option.optionId} className="flex items-center gap-2">
                <RadioGroupItem
                  value={option.value}
                  id={`${field.fieldId}-${option.optionId}`}
                />
                <Label htmlFor={`${field.fieldId}-${option.optionId}`}>
                  {option.value}
                </Label>
              </div>
            ))}
          </RadioGroup>
        );

      case "select":
        return (
          <Select
            value={value || ""}
            onValueChange={(val) => handleFieldChange(field.fieldId, val)}
            required={field.required}
          >
            <SelectTrigger>
              <SelectValue placeholder={`Select ${field.name}`} />
            </SelectTrigger>
            <SelectContent>
              {field.options.length ? (
                field.options?.map((option) => (
                  <SelectItem
                    key={option?.optionId}
                    value={option?.value || " "}
                  >
                    {option.value}
                  </SelectItem>
                ))
              ) : (
                <SelectItem value={"No value"}>No value</SelectItem>
              )}
            </SelectContent>
          </Select>
        );

      case "autocomplete":
        return (
          <Select
            value={value || ""}
            onValueChange={(val) => handleFieldChange(field.fieldId, val)}
            required={field.required}
          >
            <SelectTrigger>
              <SelectValue placeholder={`Select ${field.name}`} />
            </SelectTrigger>
            <SelectContent>
              {field.options.length ? (
                field.options?.map((option) => (
                  <SelectItem
                    key={option?.optionId}
                    value={option?.value || " "}
                  >
                    {option.value || " "}
                  </SelectItem>
                ))
              ) : (
                <SelectItem value={"No values"}>No values </SelectItem>
              )}
            </SelectContent>
          </Select>
        );

      case "autocomplete-chips":
        const chipValues = value ? [value] : [];
        return (
          <div className="space-y-2">
            <Select
              onValueChange={(val) => {
                if (!chipValues?.includes(val)) {
                  handleFieldChange(field.fieldId, [...chipValues, val]);
                }
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder={`Select ${field.name}`} />
              </SelectTrigger>
              <SelectContent>
                {field.options.length ? (
                  field.options?.map((option) => (
                    <SelectItem
                      key={option?.optionId}
                      value={option?.value || " "}
                    >
                      {option.value || " "}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value={"No values"}>No values </SelectItem>
                )}
              </SelectContent>
            </Select>
            {chipValues?.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {chipValues?.map((chip: string, idx: number) => (
                  <Badge key={idx} variant="secondary" className="gap-1">
                    {chip}
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() =>
                        handleFieldChange(
                          field.fieldId,
                          chipValues?.filter(
                            (_: string, i: number) => i !== idx
                          )
                        )
                      }
                    />
                  </Badge>
                ))}
              </div>
            )}
          </div>
        );

      case "file":
        return (
          <Input
            type="file"
            onChange={(e) => {
              const target = e.target as HTMLInputElement;
              const file = target.files?.[0];
              if (file) {
                handleFieldChange(field.fieldId, file.name);
              }
            }}
            required={field.required}
          />
        );

      case "table":
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
      case "textfield":
        return (
          <Input
            value={cellValue || ""}
            onChange={(e) => handleCellChange(e.target.value)}
          />
        );

      case "textarea":
        return (
          <Textarea
            value={cellValue || ""}
            onChange={(e) => handleCellChange(e.target.value)}
            rows={2}
          />
        );

      case "select":
        return (
          <Select value={cellValue || ""} onValueChange={handleCellChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              {column?.options ? (
                column.options?.map((option) => (
                  <SelectItem
                    key={option?.optionId}
                    value={option?.value || " "}
                  >
                    {option.value || " "}
                  </SelectItem>
                ))
              ) : (
                <SelectItem value={"No values"}>No values </SelectItem>
              )}
            </SelectContent>
          </Select>
        );

      case "checkbox":
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
    const tableData = (formData[field.fieldId] || []) as any[];
    const columns = field.tableColumns || [];
    const actions = field.tableActions || {
      edit: false,
      view: false,
      delete: false,
    };
    const hasActions = actions.edit || actions.view || actions.delete;

    const addRow = () => {
      const newRow: any = {};
      columns.forEach((col) => {
        newRow[col.columnId] = "";
      });
      console.log(`field.id =`, field, `newRow = `, newRow);
      handleFieldChange(field.fieldId, [...tableData, newRow]);
    };

    const deleteRow = (rowIndex: number) => {
      const newTableData = tableData.filter((_, idx) => idx !== rowIndex);
      handleFieldChange(field.fieldId, newTableData);
    };

    return (
      <div className="space-y-4">
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                {columns.map((column) => (
                  <TableHead key={column.columnId}>{column.name}</TableHead>
                ))}
                {hasActions && (
                  <TableHead className="text-right">Actions</TableHead>
                )}
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
                      <TableCell key={column.columnId}>
                        {renderTableCell(
                          column,
                          rowIndex,
                          field.fieldId,
                          column.columnId
                        )}
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
        <div className="grid grid-cols-12 gap-2 items-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              navigate(-1);
            }}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
          </Button>
          <div></div>
          <div></div>
          <div className="col-span-5 text-center">
            <CardTitle className="text-primary">{worksheet.name}</CardTitle>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {worksheet.sections.map((section) => {
          // Default to 1 column layout for backward compatibility
          const layout = section.layout || 1;
          const gridCols = {
            1: "grid-cols-1",
            2: "grid-cols-1 md:grid-cols-2",
            3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
            4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
          };

          return (
            <div key={section.sectionId} className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground border-b pb-2">
                {section.name}
              </h3>
              <div className={`grid gap-4 ${gridCols[layout]}`}>
                {section.fields.map((field) => (
                  <div
                    key={field.fieldId}
                    className={`space-y-2 ${
                      field.type === "table" ? "col-span-full" : ""
                    }`}
                  >
                    <Label>
                      {field.name}
                      {field.required && (
                        <span className="text-destructive ml-1">*</span>
                      )}
                    </Label>
                    {renderField(field)}
                  </div>
                ))}
              </div>
            </div>
          );
        })}

        <div className="flex gap-4 pt-6 border-t">
          <Button loading={saveLoading} onClick={handleSave} className="flex-1">
            <Save className="h-4 w-4 mr-2" />
            {currentRecordId ? "Update" : "Save"}
          </Button>
          <Button onClick={handleReset} variant="outline" className="flex-1">
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
