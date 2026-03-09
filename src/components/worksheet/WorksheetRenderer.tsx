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
  Clipboard,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { saveRecord, updateRecord } from "@/services/worksheet.services";
import { useNavigate } from "react-router-dom";
import { getItem, setItem, storageKeys } from "@/utils/storage";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";

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
  const [showPasteBtn, setShowPasteBtn] = useState<boolean>(false);
  const [openModal, setOpenModal] = useState<boolean>();
  const { toast } = useToast();
  const navigate = useNavigate();

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

  const handleFieldChange = (field_id: string, value: any) => {
    const newData = { ...formData, [field_id]: value };
    setFormData(newData);
    onChange?.(newData);
  };

  const handleSave = () => {
    const jobId = recordId?.split("_")[1] || "";
    const record: any = {
      job_id: jobId,
      record_id: recordId,
      client_id: clientId,
      worksheet_id: worksheet.worksheet_id,
      data: formData,
    };
    onSubmit && onSubmit(record);
    setCurrentRecordId(recordId || "");
    if (Object.entries(data).length > 0) {
      update(record);
    } else {
      save(record);
    }
  };

  const handleReset = () => {
    setFormData({});
    onChange?.({});
    toast({
      title: "Reset Complete",
      description: "Form has been cleared",
    });
  };

  const handlePaste = () => {
    const copiedData = getItem(storageKeys.copied);
    if (worksheet?.worksheet_id && copiedData[worksheet.worksheet_id]) {
        setFormData(copiedData[worksheet.worksheet_id].data);
        delete copiedData[worksheet.worksheet_id];
        setItem(storageKeys.copied, copiedData);
        setShowPasteBtn(false);
    }
  };

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCancel = (status: boolean | any) => {
    const copiedData = getItem(storageKeys.copied);
    if (worksheet?.worksheet_id) {
        delete copiedData[worksheet.worksheet_id];
        setItem(storageKeys.copied, copiedData);
    }
    setShowPasteBtn(false);
    if (typeof status == "boolean") {
      setOpenModal(status);
    } else {
      setOpenModal(false);
    }
  };

  useEffect(() => {
    try {
      const sheetData = getItem(storageKeys.copied);
      if (worksheet?.worksheet_id && sheetData[worksheet.worksheet_id]) {
        setShowPasteBtn(true);
      }
    } catch (error) {
      console.log(error);
    }
  }, [worksheet?.worksheet_id]);

  const renderField = (field: WorksheetField) => {
    const value = formData[field.field_id];
    switch (field.type) {
      case "textfield":
        return (
          <Input
            value={value || ""}
            onChange={(e) => handleFieldChange(field.field_id, e.target.value)}
            placeholder={`Enter ${field.name}`}
            required={field.required}
          />
        );

      case "textarea":
        return (
          <Textarea
            value={value || ""}
            onChange={(e) => handleFieldChange(field.field_id, e.target.value)}
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
                handleFieldChange(field.field_id, checked)
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
            onValueChange={(val) => handleFieldChange(field.field_id, val)}
            required={field.required}
          >
            {field.options?.map((option) => (
              <div key={option.option_id} className="flex items-center gap-2">
                <RadioGroupItem
                  value={option.value}
                  id={`${field.field_id}-${option.option_id}`}
                />
                <Label htmlFor={`${field.field_id}-${option.option_id}`}>
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
            onValueChange={(val) => handleFieldChange(field.field_id, val)}
            required={field.required}
          >
            <SelectTrigger>
              <SelectValue placeholder={`Select ${field.name}`} />
            </SelectTrigger>
            <SelectContent>
              {field.options?.length ? (
                field.options.map((option) => (
                  <SelectItem
                    key={option?.option_id}
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
            onValueChange={(val) => handleFieldChange(field.field_id, val)}
            required={field.required}
          >
            <SelectTrigger>
              <SelectValue placeholder={`Select ${field.name}`} />
            </SelectTrigger>
            <SelectContent>
              {field.options?.length ? (
                field.options.map((option) => (
                  <SelectItem
                    key={option?.option_id}
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
        const chipValues = Array.isArray(value) ? value : [];
        return (
          <div className="space-y-2">
            <Select
              onValueChange={(val) => {
                if (!chipValues.includes(val)) {
                  handleFieldChange(field.field_id, [...chipValues, val]);
                }
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder={`Select ${field.name}`} />
              </SelectTrigger>
              <SelectContent>
                {field.options?.length ? (
                  field.options.map((option) => (
                    <SelectItem
                      key={option?.option_id}
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
            {chipValues.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {chipValues.map((chip: string, idx: number) => (
                  <Badge key={idx} variant="secondary" className="gap-1">
                    {chip}
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() =>
                        handleFieldChange(
                          field.field_id,
                          chipValues.filter((_, i) => i !== idx)
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
                handleFieldChange(field.field_id, file.name);
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
    field_id: string,
    column_id: string
  ) => {
    const tableData = formData[field_id] || [];
    const cellValue = tableData[rowIndex]?.[column_id];

    const handleCellChange = (value: any) => {
      const newTableData = [...tableData];
      if (!newTableData[rowIndex]) {
        newTableData[rowIndex] = {};
      }
      newTableData[rowIndex][column_id] = value;
      handleFieldChange(field_id, newTableData);
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
                column.options.map((option) => (
                  <SelectItem
                    key={option?.option_id}
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
    const tableData = (formData[field.field_id] || []) as any[];
    const columns = field.table_columns || [];
    const actions = field.table_actions || {
      edit: false,
      view: false,
      delete: false,
    };
    const hasActions = actions.edit || actions.view || actions.delete;

    const addRow = () => {
      const newRow: any = {};
      columns.forEach((col) => {
        newRow[col.column_id] = "";
      });
      handleFieldChange(field.field_id, [...tableData, newRow]);
    };

    const deleteRow = (rowIndex: number) => {
      const newTableData = tableData.filter((_, idx) => idx !== rowIndex);
      handleFieldChange(field.field_id, newTableData);
    };

    return (
      <div className="space-y-4">
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                {columns.map((column) => (
                  <TableHead key={column.column_id}>{column.name}</TableHead>
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
                      <TableCell key={column.column_id}>
                        {renderTableCell(
                          column,
                          rowIndex,
                          field.field_id,
                          column.column_id
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
    <>
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div className="flex justify-start items-center">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  navigate(-1);
                }}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
              </Button>
            </div>
            <div className="col-span-5 text-center flex justify-between items-center">
              <CardTitle className="text-primary">{worksheet.name}</CardTitle>
            </div>
            <div className="flex justify-end items-center">
              {showPasteBtn && (
                <Button variant="link" onClick={handleOpenModal}>
                  Paste <Clipboard />
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {worksheet.sections?.map((section) => {
            const layout = section.layout || 1;
            const gridCols: Record<number, string> = {
              1: "grid-cols-1",
              2: "grid-cols-1 md:grid-cols-2",
              3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
              4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
            };

            return (
              <div key={section.section_id} className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground border-b pb-2">
                  {section.name}
                </h3>
                <div className={`grid gap-4 ${gridCols[layout] || gridCols[1]}`}>
                  {section.fields?.map((field) => (
                    <div
                      key={field.field_id}
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
            <Button
              disabled={saveLoading || updateLoading}
              onClick={handleSave}
              className="flex-1"
            >
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
      <Dialog open={openModal} onOpenChange={handleCancel}>
        <DialogContent className="max-w-2xl overflow-y-auto p-0">
          <DialogHeader className="p-3">
            <DialogTitle>Paste copied data</DialogTitle>
          </DialogHeader>
          <div className="py-5 px-3">Do you want to paste the copied data?</div>
          <div className="flex justify-end items-center py-4 px-2 gap-3 border-t">
            <Button size="sm" onClick={handlePaste}>
              Paste <Clipboard />
            </Button>
            <Button size="sm" variant="destructive" onClick={handleCancel}>
              Cancel <X />
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
