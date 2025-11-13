import { Field } from "@/types/worksheet.type";
import { Button } from "@/components/ui/button";
import { Eye, Edit, Trash2, Plus } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface TableRendererProps {
  field: Field;
}

export const TableRenderer = ({ field }: TableRendererProps) => {
  const [rows, setRows] = useState<number[]>([1]);
  const config = field.tableConfig;

  if (!config) return null;

  const addRow = () => {
    setRows([...rows, rows.length + 1]);
  };

  const removeRow = (index: number) => {
    setRows(rows.filter((_, i) => i !== index));
  };

  const renderCell = (columnType: string, rowIndex: number, colIndex: number) => {
    const key = `${rowIndex}-${colIndex}`;

    switch (columnType) {
      case 'text':
        return <Input key={key} className="min-w-[150px]" />;
      case 'textarea':
        return <Textarea key={key} rows={2} className="min-w-[200px]" />;
      case 'dropdown':
        return (
          <Select key={key}>
            <SelectTrigger className="min-w-[150px]">
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">Option 1</SelectItem>
              <SelectItem value="2">Option 2</SelectItem>
              <SelectItem value="3">Option 3</SelectItem>
            </SelectContent>
          </Select>
        );
      case 'checkbox':
        return (
          <div key={key} className="flex items-center justify-center">
            <Checkbox />
          </div>
        );
      case 'date':
        return <Input key={key} type="date" className="min-w-[150px]" />;
      default:
        return <Input key={key} />;
    }
  };

  const hasActions = config.showEdit || config.showView || config.showDelete;

  return (
    <Card className="p-4">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold">{field.label}</h3>
        <Button onClick={addRow} size="sm" variant="outline">
          <Plus className="w-4 h-4 mr-1" />
          Add Row
        </Button>
      </div>

      <div className="border rounded-lg overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              {config.columns.map((column) => (
                <TableHead key={column.id} className="font-semibold">
                  {column.name}
                </TableHead>
              ))}
              {hasActions && <TableHead className="font-semibold">Actions</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row, rowIndex) => (
              <TableRow key={row}>
                {config.columns.map((column, colIndex) => (
                  <TableCell key={column.id}>
                    {renderCell(column.type, rowIndex, colIndex)}
                  </TableCell>
                ))}
                {hasActions && (
                  <TableCell>
                    <div className="flex items-center gap-1">
                      {config.showView && (
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Eye className="w-4 h-4" />
                        </Button>
                      )}
                      {config.showEdit && (
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Edit className="w-4 h-4" />
                        </Button>
                      )}
                      {config.showDelete && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive hover:text-destructive"
                          onClick={() => removeRow(rowIndex)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
};
