import { useState } from "react";
import {
  TableColumn,
  TableActions,
  FieldType,
  FieldOption,
} from "@/types/worksheet.type";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Trash2, Settings } from "lucide-react";
import { createRandomId } from "@/utils/cryptog";

interface TableBuilderProps {
  columns: TableColumn[];
  actions: TableActions;
  onUpdate: (columns: TableColumn[], actions: TableActions) => void;
}

const COLUMN_TYPES: { value: FieldType; label: string }[] = [
  { value: "textfield", label: "Text Field" },
  { value: "textarea", label: "Text Area" },
  { value: "select", label: "Select Box" },
  { value: "checkbox", label: "Checkbox" },
];

const TYPES_WITH_OPTIONS: FieldType[] = ["select"];

export function TableBuilder({
  columns,
  actions,
  onUpdate,
}: TableBuilderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [editingColumns, setEditingColumns] = useState<TableColumn[]>(columns);
  const [editingActions, setEditingActions] = useState<TableActions>(actions);

  const addColumn = () => {
    const newColumn: TableColumn = {
      column_id: createRandomId("TABLECOL"),
      name: "",
      type: "textfield",
    };
    setEditingColumns([...editingColumns, newColumn]);
  };

  const updateColumn = (column_id: string, updates: Partial<TableColumn>) => {
    setEditingColumns(
      editingColumns.map((col) =>
        col.column_id === column_id ? { ...col, ...updates } : col
      )
    );
  };

  const deleteColumn = (column_id: string) => {
    setEditingColumns(editingColumns.filter((col) => col.column_id !== column_id));
  };

  const addOption = (column_id: string) => {
    const column = editingColumns.find((col) => col.column_id === column_id);
    if (!column) return;

    const newOption: FieldOption = {
      option_id: createRandomId("TABLEOPT"),
      value: "",
    };
    updateColumn(column_id, {
      options: [...(column.options || []), newOption],
    });
  };

  const updateOption = (column_id: string, option_id: string, value: string) => {
    const column = editingColumns.find((col) => col.column_id === column_id);
    if (!column) return;

    updateColumn(column_id, {
      options: column.options?.map((opt) =>
        opt.option_id === option_id ? { ...opt, value } : opt
      ),
    });
  };

  const deleteOption = (column_id: string, option_id: string) => {
    const column = editingColumns.find((col) => col.column_id === column_id);
    if (!column) return;

    updateColumn(column_id, {
      options: column.options?.filter((opt) => opt.option_id !== option_id),
    });
  };

  const handleSave = () => {
    onUpdate(editingColumns, editingActions);
    setIsOpen(false);
  };

  const handleOpen = () => {
    setEditingColumns(columns);
    setEditingActions(actions);
    setIsOpen(true);
  };

  return (
    <>
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={handleOpen}
        className="w-full"
      >
        <Settings className="h-4 w-4 mr-2" />
        Configure Table
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Configure Table</DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            <Card>
              <CardContent className="pt-6">
                <Label className="text-base font-semibold mb-4 block">
                  Row Action Buttons
                </Label>
                <div className="flex gap-4">
                  <div className="flex items-center justify-between gap-2">
                    <Checkbox
                      id="editSettingBtn"
                      checked={editingActions.edit}
                      onCheckedChange={(checked) =>
                        setEditingActions({
                          ...editingActions,
                          edit: checked as boolean,
                        })
                      }
                    />
                    <label className="cursor-pointer" htmlFor="editSettingBtn">Edit</label>
                  </div>

                  <div className="flex items-center justify-between gap-2">
                    <Checkbox
                      id="viewSettingBtn"
                      checked={editingActions.view}
                      onCheckedChange={(checked) =>
                        setEditingActions({
                          ...editingActions,
                          view: checked as boolean,
                        })
                      }
                    />
                    <label className="cursor-pointer" htmlFor="viewSettingBtn">View</label>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <Checkbox
                      id="deleteSettingBtn"
                      checked={editingActions.delete}
                      onCheckedChange={(checked) =>
                        setEditingActions({
                          ...editingActions,
                          delete: checked as boolean,
                        })
                      }
                    />
                    <label className="cursor-pointer" htmlFor="deleteSettingBtn">Delete</label>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-base font-semibold">Table Columns</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addColumn}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Column
                </Button>
              </div>

              {editingColumns.length === 0 ? (
                <Card>
                  <CardContent className="text-center py-8">
                    <p className="text-muted-foreground mb-4">
                      No columns added yet. Add your first column to get
                      started.
                    </p>
                    <Button onClick={addColumn} size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Column
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-3">
                  {editingColumns.map((column, index) => {
                    const showOptions = TYPES_WITH_OPTIONS.includes(
                      column.type
                    );

                    return (
                      <Card key={column.column_id}>
                        <CardContent className="pt-6 space-y-4">
                          <div className="flex gap-4 items-start">
                            <div className="flex-1 grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label>Column Name</Label>
                                <Input
                                  value={column.name}
                                  onChange={(e) =>
                                    updateColumn(column.column_id, {
                                      name: e.target.value,
                                    })
                                  }
                                  placeholder={`Column ${index + 1}`}
                                />
                              </div>

                              <div className="space-y-2">
                                <Label>Column Type</Label>
                                <Select
                                  value={column.type}
                                  onValueChange={(value: FieldType) =>
                                    updateColumn(column.column_id, { type: value })
                                  }
                                >
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {COLUMN_TYPES.map((type) => (
                                      <SelectItem
                                        key={type.value}
                                        value={type.value}
                                      >
                                        {type.label}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>

                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => deleteColumn(column.column_id)}
                              className="text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>

                          {showOptions && (
                            <div className="space-y-2 pl-4 border-l-2 border-muted">
                              <div className="flex items-center justify-between">
                                <Label className="text-sm">Options</Label>
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={() => addOption(column.column_id)}
                                >
                                  <Plus className="h-3 w-3 mr-1" />
                                  Add Option
                                </Button>
                              </div>

                              <div className="space-y-2">
                                {column.options?.map((option, optIndex) => (
                                  <div
                                    key={option.option_id}
                                    className="flex items-center gap-2"
                                  >
                                    <Input
                                      value={option.value}
                                      onChange={(e) =>
                                        updateOption(
                                          column.column_id,
                                          option.option_id,
                                          e.target.value
                                        )
                                      }
                                      placeholder={`Option ${optIndex + 1}`}
                                    />
                                    <Button
                                      type="button"
                                      variant="ghost"
                                      size="icon"
                                      onClick={() =>
                                        deleteOption(column.column_id, option.option_id)
                                      }
                                      className="text-destructive"
                                    >
                                      <Trash2 className="h-3 w-3" />
                                    </Button>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>Save Table Configuration</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
