import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { getPreviousData } from "@/services/worksheet.services";
import {
  Worksheet,
  WorksheetRecord,
  WorksheetField,
} from "@/types/worksheet.type";
import { CheckCheck, Calendar, Copy,ArrowLeft } from "lucide-react";
import moment from "moment";
import { Button } from "@/components/ui/button";
import { getItem, setItem, storageKeys } from "@/utils/storage";
import { Alert } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";

function PreviousReports() {
  const { id } = useParams();
  const navigate = useNavigate()
  const {toast} = useToast()
  const { data: response, isLoading } = useQuery({
    queryKey: [`${id}previousdata`, id],
    queryFn: () => getPreviousData(id),
  });

  // response.data expected: { worksheet: Worksheet, records: WorksheetRecord[] }
  const worksheet: Worksheet = response?.data?.worksheet;
  const records: WorksheetRecord[] = response?.data?.records;
  const handleCopyValue = (data: any) => {
    console.log(data);
    let copiedData = getItem(storageKeys.copied);
    if (copiedData) {
      copiedData[id] = data;
    } else {
      copiedData = { [id]: data };
    }
    setItem(storageKeys.copied,copiedData)
     toast({
       title:"Copied", 
       description:<span>Data copied </span>,
       className:"bg-green-500 text-white"
     })
  };
  const renderFieldValue = (field: WorksheetField, recordData: any) => {
    const value = recordData[field.fieldId];
    if (value === undefined || value === null) return "-";

    switch (field.type) {
      case "checkbox":
        return value ? "Yes" : "No";
      case "autocomplete-chips":
        return Array.isArray(value) ? value.join(", ") : "-";
      case "file":
        return value || " ";
      case "table":
        return null; // Tables rendered separately
      default:
        return value || " ";
    }
  };

  const handleNaavigate = ()=>{
    navigate(-1)
  }

  const renderRecords = () => {
    return records?.map((record) => (
      <div
        key={record.recordId}
        className="bg-white rounded-xl border border-slate-200 shadow-sm mb-8 overflow-hidden"
      >
        {/* Record Header - Compact Meta */}
        <div className="bg-slate-50 px-4 py-3 border-b border-slate-200 flex justify-between items-center text-xs">
          <div className="flex items-center gap-2 font-semibold text-slate-700">
            <Calendar size={14} />
            {moment(record.createdAt).format("DD MMM YYYY | HH:mm A")}
          </div>
          <span className="font-mono bg-white px-2 py-0.5 rounded border tracking-tighter">
            REF: {record.recordId}
          </span>
          <Button
            variant="ghost"
            style={{ padding: 0, height: "fit-content" }}
            onClick={() => {
              handleCopyValue(record);
            }}
          >
            copy <Copy />
          </Button>
        </div>

        <div className="p-5">
          {worksheet.sections.map((section) => (
            <div key={section.sectionId} className="mb-6 last:mb-0">
              {/* Section Header */}
              <div className="flex items-center gap-2 mb-3">
                <div className="h-4 w-1 bg-blue-500 rounded-full" />
                <h3 className="text-xs font-bold uppercase text-slate-500 tracking-wider">
                  {section.name}
                </h3>
              </div>

              {/* Dynamic Grid Layout based on SectionLayout type */}
              <div
                className={`grid gap-x-6 gap-y-2 grid-cols-1 sm:grid-cols-${section.layout}`}
              >
                {section.fields.map((field) => {
                  if (field.type === "table") {
                    const tableRows = record.data[field.fieldId] || [];
                    return (
                      <div key={field.fieldId} className="col-span-full mt-2">
                        <span className="text-[11px] font-bold text-slate-400 uppercase">
                          {field.name}
                        </span>
                        <div className="mt-1 border rounded-lg overflow-hidden">
                          <table className="w-full text-[11px] border-collapse">
                            <thead className="bg-slate-50 border-b">
                              <tr>
                                {field.tableColumns?.map((col) => (
                                  <th
                                    key={col.columnId}
                                    className="p-2 text-left border-r last:border-0 font-bold text-slate-600"
                                  >
                                    {col.name}
                                  </th>
                                ))}
                              </tr>
                            </thead>
                            <tbody>
                              {tableRows.map((row: any, i: number) => (
                                <tr
                                  key={i}
                                  className="border-b last:border-0 hover:bg-slate-50/50"
                                >
                                  {field.tableColumns?.map((col) => (
                                    <td
                                      key={col.columnId}
                                      className="p-2 border-r last:border-0"
                                    >
                                      {col.type === "checkbox"
                                        ? row[col.columnId]
                                          ? "Yes"
                                          : "No"
                                        : row[col.columnId]}
                                    </td>
                                  ))}
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    );
                  }

                  return (
                    <div
                      key={field.fieldId}
                      className="flex flex-row py-1 border-b border-slate-50 gap-2"
                    >
                      <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-tight">
                        {field.name}
                      </label>
                      <div className="text-xs text-slate-800 font-medium truncate">
                        {renderFieldValue(field, record.data)}
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
      <div className="p-20 text-center text-slate-400 animate-pulse">
        Retrieving records...
      </div>
    );

  return (
    <div className="bg-slate-100 min-h-screen pt-1 pb-10 px-4">
      <div className="max-w-5xl mx-auto pt-2">
        {/* Page Header */}
        <Button className="my-4" size="sm" variant="outline" onClick={handleNaavigate}><ArrowLeft /> Back</Button>
        <div className="flex justify-between items-end mb-8 border-b border-slate-300 pb-4">
          <div>
            <h1 className="text-2xl font-black text-slate-900 leading-tight">
              {worksheet?.name}
            </h1>
            <p className="text-slate-500 text-sm">
              {worksheet?.description || "No description provided"}
            </p>
          </div>
          <div className="text-right text-[10px] text-slate-400 font-bold uppercase">
            Total Records: {records?.length || 0}
          </div>
        </div>

        {records?.length ? (
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
