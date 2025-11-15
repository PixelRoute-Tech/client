import { useRef, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useReactToPrint } from "react-to-print";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Printer } from "lucide-react";
import { worksheetStorage } from "@/utils/worksheetStorage";
import { worksheetDataStorage } from "@/utils/worksheetDataStorage";
import { Worksheet, WorksheetField } from "@/types/worksheet.type";
import { useQuery } from "@tanstack/react-query";
import { getRecordData } from "@/services/worksheet.services";

export default function WorksheetReport() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const recordId = searchParams.get("recordId");
  const navigate = useNavigate();
  const printRef = useRef<HTMLDivElement>(null);
  const [worksheet,setWorkSheet] = useState<Worksheet>()
  const [record,setRecord] = useState<any>()
  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: "NDTP-Inspection-Report",
  });

  const { isLoading: loadingData } = useQuery({
    queryKey: [`${id}forworksheetreport`, id],
    queryFn: async () => getRecordData(id),
    onSuccess:(result)=>{
       setRecord(result.data[0].record)
       setWorkSheet(result.data[0].worksheet)
    }
  });

  // const worksheet = worksheetStorage.getById(id || "");
  // const record = recordId ? worksheetDataStorage.getById(recordId) : null;

  if (!worksheet || !record) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground mb-4">
            Report Not Found
          </h2>
          <Button onClick={() => navigate(-1)}>Go Back</Button>
        </div>
      </div>
    );
  }

  const data = record.data;

  const renderFieldValue = (field: WorksheetField) => {
    const value = data[field.fieldId];

    switch (field.type) {
      case "checkbox":
        return value ? "Yes" : "No";
      case "autocomplete-chips":
        return Array.isArray(value) ? value.join(", ") : "-";
      case "file":
        return value || "-";
      case "table":
        return null; // Tables rendered separately
      default:
        return value || "-";
    }
  };

  return (
    <div className="min-h-screen bg-muted/30 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Action Bar */}
        <div className="flex justify-between items-center mb-6">
          <Button
            variant="outline"
            onClick={() => navigate(-1)}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <Button onClick={handlePrint} className="gap-2">
            <Printer className="h-4 w-4" />
            Print Report
          </Button>
        </div>

        {/* Printable Report */}
        <div ref={printRef} className="bg-white">
          <style>
            {`
              @media print {
                @page {
                  size: A4;
                  margin: 5mm;
                }
                body {
                  print-color-adjust: exact;
                  -webkit-print-color-adjust: exact;
                }
                .no-print {
                  display: none !important;
                }
              }
            `}
          </style>

          {/* Header */}
          <div className="border-b-2 border-gray-800 p-6 flex justify-between items-start">
            <div className="flex items-center gap-4">
              <div className="w-24 h-24 border-2 border-gray-300 flex items-center justify-center text-xs text-gray-500">
                [Company Logo]
              </div>
              <div>
                <h1 className="text-sm font-bold text-gray-900">
                  NDT Plus Pty Ltd
                </h1>
                <p className="text-xs text-gray-600">Non Destructive Testing</p>
              </div>
            </div>
            <div className="py-6 border-b border-gray-300">
            <h2 className="text-2xl font-bold text-gray-900 uppercase tracking-wide">
              {worksheet.name}
            </h2>
          </div>
            <div className="text-right text-xs text-gray-700">
              <p className="font-semibold">ABN: 74 361 341 455</p>
              <p className="text-blue-600">enquiries@ndtplus.com.au</p>
              <p>ph: +61 8 6161 3445</p>
            </div>
          </div>
          

          {/* Report Details Grid */}
          <div className="p-6">
            {worksheet.sections.map((section, sectionIndex) => (
              <div key={section.sectionId} className="mb-8">
                {/* Section Title */}
                <div className="bg-gray-100 border-l-4 border-gray-800 px-4 py-2 mb-4">
                  <h3 className="font-bold text-gray-900 text-sm uppercase">
                    {section.name}
                  </h3>
                </div>

                {/* Section Fields */}
                <div className="space-y-3">
                  {section.fields.map((field) => {
                    if (field.type === "table") {
                      const tableData = data[field.fieldId] || [];
                      return (
                        <div key={field.fieldId} className="mt-6">
                          <h4 className="font-bold text-sm text-gray-900 mb-2">
                            {field.name}:
                          </h4>
                          {tableData.length === 0 ? (
                            <p className="text-sm text-gray-600 italic">
                              No data
                            </p>
                          ) : (
                            <table className="w-full border-collapse border border-gray-400 text-xs">
                              <thead>
                                <tr className="bg-gray-200">
                                  {field.tableColumns?.map((col) => (
                                    <th
                                      key={col.columnId}
                                      className="border border-gray-400 px-3 py-2 text-left font-bold"
                                    >
                                      {col.name}
                                    </th>
                                  ))}
                                </tr>
                              </thead>
                              <tbody>
                                {tableData.map((row: any, idx: number) => (
                                  <tr key={idx} className="even:bg-gray-50">
                                    {field.tableColumns?.map((col) => (
                                      <td
                                        key={col.columnId}
                                        className="border border-gray-400 px-3 py-2"
                                      >
                                        {col.type === "checkbox"
                                          ? row[col.columnId]
                                            ? "Yes"
                                            : "No"
                                          : row[col.columnId] || "-"}
                                      </td>
                                    ))}
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          )}
                        </div>
                      );
                    }

                    return (
                      <div
                        key={field.fieldId}
                        className="grid grid-cols-3 gap-4 text-sm"
                      >
                        <div className="font-bold text-gray-900">
                          {field.name}:
                        </div>
                        <div className="col-span-2 text-gray-700">
                          {renderFieldValue(field)}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {sectionIndex < worksheet.sections.length - 1 && (
                  <hr className="mt-6 border-gray-300" />
                )}
              </div>
            ))}

            {/* Report Footer */}
            <div className="mt-12 pt-6 border-t-2 border-gray-800">
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <p className="text-sm font-bold text-gray-900 mb-4">
                    Reported By:
                  </p>
                  <div className="border-b border-gray-400 w-48 mb-2"></div>
                  <p className="text-xs text-gray-600">Signature</p>
                </div>
                <div className="text-right">
                  <div className="w-32 h-32 border-2 border-gray-300 ml-auto flex items-center justify-center text-xs text-gray-500">
                    [Certification Logo]
                  </div>
                </div>
              </div>
            </div>

            {/* Page Footer */}
            <div className="mt-8 pt-4 border-t border-gray-300 text-center text-xs text-gray-500">
              <p>
                Generated on: {new Date(record.updatedAt).toLocaleDateString()}{" "}
                {new Date(record.updatedAt).toLocaleTimeString()}
              </p>
              <p className="mt-2">Page 1 of 1</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
