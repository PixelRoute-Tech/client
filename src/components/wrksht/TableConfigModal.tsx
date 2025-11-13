import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TableConfig, TableColumn, FieldType } from "@/types/worksheet.type";
import { Plus, Trash2 } from "lucide-react";
import { Card } from "@/components/ui/card";

interface TableConfigModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (config: TableConfig) => void;
  initialConfig?: TableConfig;
}

export const TableConfigModal = ({
  open,
  onClose,
  onSave,
  initialConfig,
}: TableConfigModalProps) => {
  const [columns, setColumns] = useState<TableColumn[]>(
    initialConfig?.columns || [{ id: '1', name: 'Column 1', type: 'text' }]
  );
  const [showEdit, setShowEdit] = useState(initialConfig?.showEdit ?? true);
  const [showView, setShowView] = useState(initialConfig?.showView ?? true);
  const [showDelete, setShowDelete] = useState(initialConfig?.showDelete ?? true);

  const addColumn = () => {
    const newId = (columns.length + 1).toString();
    setColumns([...columns, { id: newId, name: `Column ${newId}`, type: 'text' }]);
  };

  const removeColumn = (id: string) => {
    setColumns(columns.filter((col) => col.id !== id));
  };

  const updateColumn = (id: string, updates: Partial<TableColumn>) => {
    setColumns(columns.map((col) => (col.id === id ? { ...col, ...updates } : col)));
  };

  const handleSave = () => {
    onSave({ columns, showEdit, showView, showDelete });
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Configure Table</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div>
            <div className="flex items-center justify-between mb-3">
              <Label>Table Columns</Label>
              <Button onClick={addColumn} size="sm" variant="outline">
                <Plus className="w-4 h-4 mr-1" />
                Add Column
              </Button>
            </div>

            <div className="space-y-3">
              {columns.map((column, index) => (
                <Card key={column.id} className="p-4">
                  <div className="flex gap-3 items-end">
                    <div className="flex-1">
                      <Label className="text-xs mb-1">Column Name</Label>
                      <Input
                        value={column.name}
                        onChange={(e) =>
                          updateColumn(column.id, { name: e.target.value })
                        }
                        placeholder="Enter column name"
                      />
                    </div>

                    <div className="flex-1">
                      <Label className="text-xs mb-1">Input Type</Label>
                      <Select
                        value={column.type}
                        onValueChange={(value: FieldType) =>
                          updateColumn(column.id, { type: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="text">Text</SelectItem>
                          <SelectItem value="textarea">Text Area</SelectItem>
                          <SelectItem value="dropdown">Dropdown</SelectItem>
                          <SelectItem value="date">Date</SelectItem>
                          <SelectItem value="checkbox">Checkbox</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {columns.length > 1 && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeColumn(column.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          </div>

          <div>
            <Label className="mb-3 block">Row Action Buttons</Label>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="edit"
                  checked={showEdit}
                  onCheckedChange={(checked) => setShowEdit(checked as boolean)}
                />
                <label htmlFor="edit" className="text-sm cursor-pointer">
                  Show Edit Button
                </label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="view"
                  checked={showView}
                  onCheckedChange={(checked) => setShowView(checked as boolean)}
                />
                <label htmlFor="view" className="text-sm cursor-pointer">
                  Show View Button
                </label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="delete"
                  checked={showDelete}
                  onCheckedChange={(checked) => setShowDelete(checked as boolean)}
                />
                <label htmlFor="delete" className="text-sm cursor-pointer">
                  Show Delete Button
                </label>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save Configuration</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
