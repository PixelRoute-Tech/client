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
    const value = recordData[field.fieldId];

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

  const handleNavigate = () => navigate(-1);

  const renderRecords = () => {
    return records.map((record) => (
      <div
        key={record?.recordId ?? Math.random()}
        className="bg-white rounded-xl border border-slate-200 shadow-sm mb-8 overflow-hidden"
      >
        {/* Record Header */}
        <div className="bg-slate-50 px-4 py-3 border-b border-slate-200 flex justify-between items-center text-xs">
          <div className="flex items-center gap-2 font-semibold text-slate-700">
            <Calendar size={14} />
            {record?.createdAt 
              ? moment(record.createdAt).format("DD MMM YYYY | HH:mm A") 
              : "Date Unknown"}
          </div>
          <span className="font-mono bg-white px-2 py-0.5 rounded border tracking-tighter">
            REF: {record?.recordId ?? "N/A"}
          </span>
          <Button
            variant="ghost"
            className="h-fit p-0 flex gap-1 items-center text-blue-600 hover:text-blue-800"
            onClick={() => handleCopyValue(record)}
          >
            copy <Copy size={12} />
          </Button>
        </div>

        <div className="p-5">
          {/* Ensure sections exist before mapping */}
          {(worksheet?.sections ?? []).map((section) => (
            <div key={section?.sectionId ?? Math.random()} className="mb-6 last:mb-0">
              {/* Section Header */}
              <div className="flex items-center gap-2 mb-3">
                <div className="h-4 w-1 bg-blue-500 rounded-full" />
                <h3 className="text-xs font-bold uppercase text-slate-500 tracking-wider">
                  {section?.name ?? "Unnamed Section"}
                </h3>
              </div>

              {/* Layout Safety: Fallback to 1 column if layout is undefined */}
              <div
                className={`grid gap-x-6 gap-y-2 grid-cols-1 sm:grid-cols-${section?.layout ?? 1}`}
              >
                {(section?.fields ?? []).map((field) => {
                  if (!field) return null;

                  if (field.type === "table") {
                    // Safe access to table data
                    const tableRows = record?.data?.[field.fieldId] ?? [];
                    const columns = field.tableColumns ?? [];

                    return (
                      <div key={field.fieldId} className="col-span-full mt-2">
                        <span className="text-[11px] font-bold text-slate-400 uppercase">
                          {field.name ?? "Table"}
                        </span>
                        <div className="mt-1 border rounded-lg overflow-x-auto">
                          <table className="w-full text-[11px] border-collapse">
                            <thead className="bg-slate-50 border-b">
                              <tr>
                                {columns.map((col) => (
                                  <th
                                    key={col?.columnId ?? Math.random()}
                                    className="p-2 text-left border-r last:border-0 font-bold text-slate-600 whitespace-nowrap"
                                  >
                                    {col?.name ?? "-"}
                                  </th>
                                ))}
                              </tr>
                            </thead>
                            <tbody>
                              {tableRows.length > 0 ? (
                                tableRows.map((row: any, i: number) => (
                                  <tr key={i} className="border-b last:border-0 hover:bg-slate-50/50">
                                    {columns.map((col) => (
                                      <td key={col?.columnId} className="p-2 border-r last:border-0">
                                        {col?.type === "checkbox"
                                          ? (row?.[col.columnId] ? "Yes" : "No")
                                          : (row?.[col.columnId] ?? "-")}
                                      </td>
                                    ))}
                                  </tr>
                                ))
                              ) : (
                                <tr>
                                  <td colSpan={columns.length} className="p-4 text-center text-slate-300">
                                    No table data provided
                                  </td>
                                </tr>
                              )}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    );
                  }

                  // Normal Fields
                  return (
                    <div
                      key={field.fieldId}
                      className="flex flex-row py-1 border-b border-slate-50 gap-2 items-baseline"
                    >
                      <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-tight shrink-0">
                        {field.name ?? "Field"}:
                      </label>
                      <div className="text-xs text-slate-800 font-medium truncate">
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

  if (isLoading)
    return (
      <div className="p-20 text-center text-slate-400 animate-pulse font-medium">
        Retrieving records...
      </div>
    );

  return (
    <div className="bg-slate-100 min-h-screen pt-1 pb-10 px-4">
      <div className="max-w-5xl mx-auto pt-2">
        <Button 
          className="my-4 gap-2" 
          size="sm" 
          variant="outline" 
          onClick={handleNavigate}
        >
          <ArrowLeft size={16} /> Back
        </Button>

        <div className="flex justify-between items-end mb-8 border-b border-slate-300 pb-4">
          <div>
            <h1 className="text-2xl font-black text-slate-900 leading-tight">
              {worksheet?.name ?? "Worksheet Report"}
            </h1>
            <p className="text-slate-500 text-sm">
              {worksheet?.description ?? "No description provided"}
            </p>
          </div>
          <div className="text-right text-[10px] text-slate-400 font-bold uppercase">
            Total Records: {records.length}
          </div>
        </div>

        {records.length > 0 ? (
          renderRecords()
        ) : (
          <div className="bg-white rounded-xl p-10 text-center border-2 border-dashed border-slate-300 text-slate-400">
            No previous records found for this worksheet.
          </div>
        )}
      </div>
    </div>
  );
}

export default PreviousReports;