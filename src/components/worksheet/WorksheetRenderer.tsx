import { useState, useEffect } from "react";
import { Worksheet, WorksheetField, TableColumn } from "@/types/worksheet.type";
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
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { saveRecord, updateRecord } from "@/services/worksheet.services";
import { useNavigate } from "react-router-dom";
import { getItem, setItem, storageKeys } from "@/utils/storage";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import Autocomplete from "../ui/autocomplete";

export type WorksheetData = {
  [fieldId: string]: any;
};

interface WorksheetRendererProps {
  worksheet: Worksheet;
  data?: WorksheetData;
  onChange?: (data: WorksheetData) => void;
  onSubmit?: (data: WorksheetData) => void;
  recordId?: string;
  jobId?: string;
  clientId?: string;
  isEdit?: boolean;
}

export function WorksheetRenderer({
  worksheet,
  data = {},
  onChange,
  onSubmit,
  recordId,
  jobId = "",
  clientId = "",
  isEdit = false,
}: WorksheetRendererProps) {
  const [formData, setFormData] = useState<WorksheetData>(data);
  const [currentRecordId, setCurrentRecordId] = useState<string>(
    isEdit ? (recordId || "") : ""
  );
  const [showPasteBtn, setShowPasteBtn] = useState<boolean>(false);
  const [openModal, setOpenModal] = useState<boolean>();
  const { toast } = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { mutate: save, isLoading: saveLoading } = useMutation({
    mutationFn: saveRecord,
    onSuccess: (result: any) => {
      toast({
        title: "Success",
        description: "Record saved successfully",
        className: "bg-green-500 text-white",
      });
      queryClient.invalidateQueries({ queryKey: [recordId, worksheet.worksheet_id] });
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
    onSuccess: (result: any) => {
      toast({
        title: "Success",
        description: "Record updated successfully",
        className: "bg-green-500 text-white",
      });
      queryClient.invalidateQueries({ queryKey: [recordId, worksheet.worksheet_id] });
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
    // Robust UUID check or null for jobId
    const isUUID = (str: string) => /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(str);
    const sanitizedJobId = isUUID(jobId) ? jobId : null;
    
    // clientId can be any string, but sanitize "undefined" or empty to null
    const sanitizedClientId = (clientId === "undefined" || !clientId) ? null : clientId;

    const recordPayload: any = {
      job_id: sanitizedJobId,
      record_id: recordId,
      client_id: sanitizedClientId,
      worksheet_id: worksheet.worksheet_id,
      data: formData,
    };

    onSubmit && onSubmit(recordPayload);
    setCurrentRecordId(recordId || "");

    if (isEdit) {
      update(recordPayload);
    } else {
      save(recordPayload);
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
    if (data) {
      console.log("[WorksheetRenderer] Prop data changed:", data);
      setFormData(data);
    }
  }, [data]);

  useEffect(() => {
    try {
      const copiedData = getItem(storageKeys.copied);
      if (worksheet?.worksheet_id && copiedData?.[worksheet.worksheet_id]) {
        setShowPasteBtn(true);
      }
    } catch (error) {
      console.log("[WorksheetRenderer] Copy/Paste check error:", error);
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
          <Autocomplete
            options={field.options?.map(opt => ({ id: opt.option_id, label: opt.value })) || []}
            onSelect={(opt) => handleFieldChange(field.field_id, opt.label)}
            placeholder={`Search ${field.name}...`}
            value={value || ""}
          />
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
        <div className="glass-panel border-white/10 overflow-hidden shadow-lg">
          <Table>
            <TableHeader className="bg-white/5">
              <TableRow className="border-white/10 hover:bg-transparent">
                {columns.map((column) => (
                  <TableHead key={column.column_id} className="text-primary-white font-medium py-4">
                    {column.name}
                  </TableHead>
                ))}
                {hasActions && (
                  <TableHead className="text-right text-primary-white font-medium py-4">Actions</TableHead>
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {tableData.length === 0 ? (
                <TableRow className="border-white/5">
                  <TableCell
                    colSpan={columns.length + (hasActions ? 1 : 0)}
                    className="text-center text-muted-white py-12 bg-white/5"
                  >
                    <div className="flex flex-col items-center gap-2">
                      <div className="p-3 rounded-full bg-white/5">
                        <Plus className="h-6 w-6 opacity-20" />
                      </div>
                      <p>No rows added yet. Click "Add Row" to get started.</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                tableData.map((_, rowIndex) => (
                  <TableRow key={rowIndex} className="border-white/5 hover:bg-white/5 transition-colors">
                    {columns.map((column) => (
                      <TableCell key={column.column_id} className="py-3">
                        {renderTableCell(
                          column,
                          rowIndex,
                          field.field_id,
                          column.column_id
                        )}
                      </TableCell>
                    ))}
                    {hasActions && (
                      <TableCell className="text-right py-3">
                        <div className="flex justify-end gap-1">
                          {actions.view && (
                            <Button variant="ghost" size="icon" className="h-8 w-8 hover-lift btn-press hover:bg-primary/10 hover:text-primary">
                              <Eye className="h-4 w-4" />
                            </Button>
                          )}
                          {actions.edit && (
                            <Button variant="ghost" size="icon" className="h-8 w-8 hover-lift btn-press hover:bg-primary/10 hover:text-primary">
                              <Edit className="h-4 w-4" />
                            </Button>
                          )}
                          {actions.delete && (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => deleteRow(rowIndex)}
                              className="h-8 w-8 hover-lift btn-press text-destructive hover:bg-destructive/10 hover:text-destructive"
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
        <Button 
          type="button" 
          variant="outline" 
          size="sm" 
          onClick={addRow}
          className="hover-lift btn-press border-white/10 bg-white/5 hover:bg-white/10 text-primary-white"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add New Row
        </Button>
      </div>
    );
  };

  return (
    <>
      <div className="glass-panel border-white/5 shadow-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-white/10 bg-white/5 backdrop-blur-md">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate(-1)}
                className="hover-lift btn-press rounded-full hover:bg-white/10"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <h2 className="text-2xl font-light tracking-tight text-primary-white">
                {worksheet.name}
              </h2>
            </div>
            <div className="flex items-center gap-2">
              {showPasteBtn && (
                <Button 
                  variant="ghost" 
                  onClick={handleOpenModal}
                  className="hover-lift btn-press text-primary hover:text-primary-hover hover:bg-primary/10"
                >
                  <Clipboard className="h-4 w-4 mr-2" />
                  Paste
                </Button>
              )}
            </div>
          </div>
        </div>

        <div className="p-6 space-y-10">
          {worksheet.sections?.map((section) => {
            const layout = section.layout || 1;
            const gridCols: Record<number, string> = {
              1: "grid-cols-1",
              2: "grid-cols-1 md:grid-cols-2",
              3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
              4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
            };

            return (
              <div key={section.section_id} className="space-y-6">
                <div className="flex items-baseline gap-4">
                  <h3 className="text-lg font-medium text-primary-white whitespace-nowrap">
                    {section.name}
                  </h3>
                  <div className="h-px w-full bg-gradient-to-r from-white/10 to-transparent" />
                </div>
                
                <div className={`grid gap-6 ${gridCols[layout] || gridCols[1]}`}>
                  {section.fields?.map((field) => (
                    <div
                      key={field.field_id}
                      className={`space-y-2.5 ${
                        field.type === "table" ? "col-span-full mt-4" : ""
                      }`}
                    >
                      <Label className="text-sm font-medium text-body-white ml-1">
                        {field.name}
                        {field.required && (
                          <span className="text-destructive ml-1">*</span>
                        )}
                      </Label>
                      <div className="transition-all duration-200 focus-within:ring-2 focus-within:ring-primary/20 rounded-lg">
                        {renderField(field)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}

          <div className="flex gap-4 pt-8 mt-4 border-t border-white/10">
            <Button
              disabled={saveLoading || updateLoading}
              onClick={handleSave}
              className="flex-1 hover-lift btn-press bg-primary hover:bg-primary-hover text-white shadow-lg shadow-primary/20 h-11"
            >
              <Save className="h-4 w-4 mr-2" />
              {isEdit ? "Update Changes" : "Save Record"}
            </Button>
            <Button 
              onClick={handleReset} 
              variant="outline" 
              className="flex-1 hover-lift btn-press border-white/10 bg-white/5 hover:bg-white/10 h-11 text-primary-white"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset Form
            </Button>
          </div>
        </div>
      </div>

      <Dialog open={openModal} onOpenChange={handleCancel}>
        <DialogContent className="max-w-md glass-panel border-white/10 p-0 overflow-hidden shadow-2xl">
          <DialogHeader className="p-6 border-b border-white/5 bg-white/5">
            <DialogTitle className="text-xl font-light text-primary-white">Paste Data</DialogTitle>
          </DialogHeader>
          <div className="p-8 text-body-white text-center">
            <Clipboard className="h-12 w-12 text-primary mx-auto mb-4 opacity-50" />
            <p className="text-lg">Paste copied data into this worksheet?</p>
            <p className="text-sm text-muted-white mt-2">This will overwrite current field values.</p>
          </div>
          <div className="flex justify-end items-center p-4 gap-3 bg-black/20 border-t border-white/5">
            <Button variant="outline" size="sm" onClick={handleCancel} className="hover-lift btn-press border-white/10">
              Cancel
            </Button>
            <Button size="sm" onClick={handlePaste} className="hover-lift btn-press bg-primary hover:bg-primary-hover text-white">
              Confirm Paste <Clipboard className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default WorksheetRenderer;
