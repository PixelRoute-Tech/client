import React, { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { getPreviousData } from "@/services/worksheet.services";
import {
  Worksheet,
  WorksheetRecord,
  WorksheetField,
} from "@/types/worksheet.type";
import { Calendar, Copy, ArrowLeft } from "lucide-react";
import moment from "moment";
import { Button } from "@/components/ui/button";
import { getItem, setItem, storageKeys } from "@/utils/storage";
import { useToast } from "@/hooks/use-toast";

function PreviousReports() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const { data: response, isLoading } = useQuery({
    queryKey: [`${id}previousdata`, id],
    queryFn: () => getPreviousData(id),
  });

  // Safe extraction with fallbacks
  const worksheet: Worksheet = response?.data?.worksheet;
  const records: WorksheetRecord[] = response?.data?.records ?? [];

  const handleCopyValue = (data: any) => {
    if (!data) return;
    let copiedData = getItem(storageKeys.copied) || {};
    copiedData[id as string] = data;
    setItem(storageKeys.copied, copiedData);
    toast({
      title: "Copied",
      description: "Data copied successfully",
      className: "bg-green-500 text-white",
    });
  };

  const renderFieldValue = (field: WorksheetField, recordData: any) => {
    if (!field || !recordData) return "-";
    const value = recordData[field.field_id];

    if (value === undefined || value === null || value === "") return "-";

    switch (field.type) {
      case "checkbox":
        return value ? "Yes" : "No";
      case "autocomplete-chips":
        return Array.isArray(value) ? value.join(", ") : value || "-";
      case "file":
        return typeof value === "string" ? value : "Attached File";
      case "table":
        return null;
      default:
        return String(value);
    }
  };


  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-lg font-medium text-muted-foreground animate-pulse">
            Retrieving records...
          </p>
        </div>
      </div>
    );
  }

  const handleNavigate = () => navigate(-1);

  const renderRecords = () => {
    return records.map((record) => (
      <div
        key={record?.record_id ?? Math.random()}
        className="glass-panel hover-lift mb-8 overflow-hidden group"
      >
        {/* Record Header */}
        <div className="bg-primary/5 px-6 py-4 border-b border-[var(--glass-border)] flex justify-between items-center">
          <div className="flex items-center gap-3 text-sm font-semibold text-[var(--text-primary)]">
            <Calendar size={16} className="text-primary" />
            {record?.created_at 
              ? moment(record.created_at).format("DD MMM YYYY | HH:mm A") 
              : "Date Unknown"}
          </div>
          
          <div className="flex items-center gap-4">
            <span className="font-mono text-[10px] bg-[var(--glass-input-bg)] px-3 py-1 rounded-full border border-[var(--glass-border)] tracking-wider text-[var(--text-muted)]">
              REF: {record?.record_id?.slice(0, 8) ?? "N/A"}
            </span>
            <Button
              variant="outline"
              size="sm"
              className="h-8 gap-2 bg-[var(--glass-input-bg)] hover:bg-primary hover:text-white border-[var(--glass-border)] transition-all"
              onClick={() => handleCopyValue(record)}
            >
              <Copy size={14} />
              <span className="text-xs">Copy Data</span>
            </Button>
          </div>
        </div>

        <div className="p-6">
          {(worksheet?.sections ?? []).map((section) => (
            <div key={section?.section_id ?? Math.random()} className="mb-8 last:mb-0">
              {/* Section Header */}
              <div className="flex items-center gap-3 mb-5 border-b border-[var(--glass-border)] pb-2">
                <div className="h-4 w-1 bg-primary rounded-full shadow-[0_0_8px_rgba(var(--primary),0.5)]" />
                <h3 className="text-xs font-bold uppercase text-[var(--text-muted)] tracking-[0.2em] section-label">
                  {section?.name ?? "Unnamed Section"}
                </h3>
              </div>

              <div
                className={`grid gap-x-8 gap-y-4 grid-cols-1 sm:grid-cols-${section?.layout ?? 2}`}
              >
                {(section?.fields ?? []).map((field) => {
                  if (!field) return null;

                  if (field.type === "table") {
                    const tableRows = record?.data?.[field.field_id] ?? [];
                    const columns = field.table_columns ?? [];

                    return (
                      <div key={field.field_id} className="col-span-full mt-4">
                        <span className="text-[11px] font-bold text-[var(--text-muted)] uppercase tracking-wider mb-2 block">
                          {field.name ?? "Table Data"}
                        </span>
                        <div className="rounded-xl border border-[var(--glass-border)] bg-[var(--glass-input-bg)] overflow-hidden shadow-sm">
                          <div className="overflow-x-auto">
                            <table className="w-full text-[12px] border-collapse">
                              <thead>
                                <tr className="bg-primary/10 border-b border-[var(--glass-border)]">
                                  {columns.map((col) => (
                                    <th
                                      key={col?.column_id ?? Math.random()}
                                      className="p-3 text-left font-bold text-[var(--text-primary)] whitespace-nowrap border-r border-[var(--glass-border)] last:border-r-0"
                                    >
                                      {col?.name ?? "-"}
                                    </th>
                                  ))}
                                </tr>
                              </thead>
                              <tbody>
                                {tableRows.length > 0 ? (
                                  tableRows.map((row: any, i: number) => (
                                    <tr key={i} className="border-b border-[var(--glass-border)] last:border-b-0 hover:bg-white/5 transition-colors">
                                      {columns.map((col) => (
                                        <td key={col?.column_id} className="p-3 text-[var(--text-body)] border-r border-[var(--glass-border)] last:border-r-0">
                                          {col?.type === "checkbox"
                                            ? (row?.[col.column_id] ? 
                                                <span className="text-success font-bold">Yes</span> : 
                                                <span className="text-destructive font-bold">No</span>)
                                            : (row?.[col.column_id] ?? "-")}
                                        </td>
                                      ))}
                                    </tr>
                                  ))
                                ) : (
                                  <tr>
                                    <td colSpan={columns.length} className="p-6 text-center text-[var(--text-muted)] italic">
                                      No data recorded for this table
                                    </td>
                                  </tr>
                                )}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    );
                  }

                  // Normal Fields
                  return (
                    <div
                      key={field.field_id}
                      className="flex flex-col py-2 border-b border-[var(--glass-border)] last:border-b-0 group/field"
                    >
                      <label className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider mb-1">
                        {field.name ?? "Field"}
                      </label>
                      <div className="text-sm text-[var(--text-primary)] font-medium leading-relaxed">
                        {renderFieldValue(field, record?.data ?? {})}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    ));
  };

  return (
    <div className="pb-20">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 mt-2">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <Button 
                className="h-9 w-9 p-0 rounded-full border-[var(--glass-border)] bg-[var(--glass-input-bg)] hover:bg-primary hover:text-white transition-all shadow-sm"
                variant="outline" 
                onClick={handleNavigate}
              >
                <ArrowLeft size={18} />
              </Button>
              <h1 className="text-3xl font-bold tracking-tight text-[var(--text-primary)]">
                {worksheet?.name ?? "Worksheet Report"}
              </h1>
            </div>
            <p className="text-[var(--text-muted)] text-sm max-w-2xl ml-12">
              {worksheet?.description ?? "Review previous inspection and worksheet records."}
            </p>
          </div>
          
          <div className="flex items-center gap-4 ml-12 md:ml-0 bg-[var(--glass-input-bg)] px-5 py-3 rounded-2xl border border-[var(--glass-border)] backdrop-blur-sm self-start">
            <div className="text-center border-r border-[var(--glass-border)] pr-4">
              <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-tighter mb-1">Items</p>
              <p className="text-xl font-bold text-primary">{records.length}</p>
            </div>
            <div className="text-center pl-1">
              <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-tighter mb-1">ID</p>
              <p className="text-xs font-mono text-[var(--text-primary)]">{id?.slice(0, 8)}</p>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          {records.length > 0 ? (
            renderRecords()
          ) : (
            <div className="glass-panel p-20 text-center flex flex-col items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-2">
                <Copy size={32} />
              </div>
              <h2 className="text-xl font-bold text-[var(--text-primary)]">No Records Found</h2>
              <p className="text-[var(--text-muted)] max-w-sm">
                This worksheet doesn't have any saved records yet. All future submissions will appear here.
              </p>
              <Button onClick={handleNavigate} variant="outline" className="mt-4">
                Return to Worksheet
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default PreviousReports;