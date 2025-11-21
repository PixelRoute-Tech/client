import { useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useReactToPrint } from "react-to-print";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Printer, Check, X } from "lucide-react";
import {
  Worksheet,
  WorksheetField,
  WorksheetRecord,
} from "@/types/worksheet.type";
import { useQuery } from "@tanstack/react-query";
import {
  getRecordData,
  JobRequestTemp,
  TechRowTemp,
} from "@/services/worksheet.services";
import { useToast } from "@/hooks/use-toast";
import SignaturePad from "react-signature-canvas";
import moment from "moment";
import { useAuth } from "@/hooks/useAuth";
import { ClientType } from "@/types/client.type";
import { UserType } from "@/types/auth";

export default function WorksheetReport() {
  const { id } = useParams();
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();
  const printRef = useRef<HTMLDivElement>(null);
  const [worksheet, setWorkSheet] = useState<Worksheet>();
  const [technician, setTechnician] = useState<UserType>();
  const [jobData, setJobData] = useState<JobRequestTemp>();
  const [record, setRecord] = useState<WorksheetRecord>();
  const [client, setClient] = useState<ClientType>();
  const [signature, setSignature] = useState<string | ArrayBuffer>("");
  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: "NDTP-Inspection-Report",
    onAfterPrint: () => {
      console.log("After print completed or print dialog was closed");
    },
  });

  const createReportNo = () => {
    if (client.clientId && jobData.jobId) {
      const set1 = parseInt(client.clientId.replace(/\D/g, ""), 10);
      const set2 = parseInt(jobData.jobId.replace(/\D/g, ""), 10);
      const set3 = moment(jobData.startDate).format("DD_YY");
      return `${set3}/${set1}_${set2}`;
    }
  };

  const { isLoading: loadingData } = useQuery({
    queryKey: [`${id}forworksheetreport`, id],
    queryFn: async () => getRecordData(id),
    onSuccess: (result) => {
      try {
        if (result?.data?.length > 0) {
          const data = result.data[0];
          if (data) {
            setRecord(data?.record);
            setWorkSheet(data?.worksheet);
            setClient(data?.client);
            setJobData(data.job);
            setTechnician(data.technician)
          }
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Oops! Something went wrong",
          className: "bg-red-500 text-white",
        });
      }
    },
  });

  const sigRef = useRef<any>(null);

  const clear = () => {
    sigRef.current.clear();
    setSignature("");
  };

  const handleUpload = (e: any) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setSignature(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

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
                  #onborder{
                     border:none; 
                  }
              }
            `}
          </style>

          {/* Header */}
          <div className="border-b-2 border-gray-800 p-6 grid grid-cols-12 items-center">
            <div className="flex items-center gap-4 col-span-3">
              <div className="w-24 h-24 border-2 border-gray-300 flex items-center justify-center text-xs text-gray-500">
                <img src={user?.company?.logo} alt="Logo" />
              </div>
              <div>
                <h1 className="text-sm font-bold text-gray-900">
                  {user?.company?.name}
                </h1>
                <p className="text-xs text-gray-600">
                  {user?.company?.description}
                </p>
              </div>
            </div>

            <div className="py-6 border-gray-300 col-span-6 ">
              <h2 className="underline text-center text-2xl font-bold text-gray-900 uppercase tracking-wide">
                {worksheet?.name}
              </h2>
            </div>

            <div className="text-right text-xs text-gray-700 col-span-3">
              <p className="font-semibold">{user?.company?.lisenceNo}</p>
              <p className="text-blue-600">{user?.company?.email}</p>
              <p>{user.company.contactNo}</p>
            </div>
          </div>

          {/* Report Details Grid */}
          <div className="p-6">
            <div className="space-y-2 grid grid-cols-2">
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div className="font-bold text-gray-900">Job description</div>
                <div className="col-span-2 text-gray-700">
                  : {worksheet?.description}
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div className="font-bold text-gray-900">Report no</div>
                <div className="col-span-2 text-gray-700">
                  : {createReportNo()}
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div className="font-bold text-gray-900">Client</div>
                <div className="col-span-2 text-gray-700">
                  : {client?.businessName}
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div className="font-bold text-gray-900">Report date</div>
                <div className="col-span-2 text-gray-700">
                  : {moment().format("DD-MM-YYYY")}
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div className="font-bold text-gray-900">Address</div>
                <div className="col-span-2 text-gray-700">
                  : {client?.businessAddress}
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div className="font-bold text-gray-900">Job no</div>
                <div className="col-span-2 text-gray-700">
                  : {jobData?.jobId}
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div className="font-bold text-gray-900">Job address</div>
                <div className="col-span-2 text-gray-700">
                  : {client?.businessAddress}
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div className="font-bold text-gray-900">P/O no</div>
                <div className="col-span-2 text-gray-700">
                  : {client?.postalAddress}
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div className="font-bold text-gray-900">Client job no</div>
                <div className="col-span-2 text-gray-700">
                  : {jobData?.jobId?.slice(3, jobData?.jobId?.length)}
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div className="font-bold text-gray-900">Attention</div>
                <div className="col-span-2 text-gray-700">
                  : {technician?.userName}
                </div>
              </div>
              <div className="col-span-full"></div>
            </div>

            <div className="space-y-2 grid grid-cols-2 my-3">
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div className="font-bold text-gray-900">Technician</div>
                <div className="col-span-2 text-gray-700">
                  : {user.userName}
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div className="font-bold text-gray-900">
                  Date of Inspection
                </div>
                <div className="col-span-2 text-gray-700">
                  : {moment().format("DD-MM-YYYY")}
                </div>
              </div>
            </div>

            <hr className="my-3 border-gray-300" />
            {worksheet?.sections?.map((section, sectionIndex) => (
              <div key={section.sectionId} className="mb-8">
                {/* Section Title */}
                {/* <div className="bg-gray-100 border-l-4 border-gray-800 px-4 py-2 mb-4">
                  <h3 className="font-bold text-gray-900 text-sm uppercase">
                    {section.name}
                  </h3>
                </div> */}

                {/* Section Fields */}
                <div className="space-y-2 grid grid-cols-2">
                  {section?.fields?.map((field) => {
                    if (field.type === "table") {
                      const tableData = data[field.fieldId] || [];
                      return (
                        <div key={field.fieldId} className="mt-6 col-span-full">
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
                                {tableData?.map((row: any, idx: number) => (
                                  <tr key={idx} className="even:bg-gray-50">
                                    {field.tableColumns?.map((col) => (
                                      <td
                                        key={col.columnId}
                                        className="border border-gray-400 px-3 py-2"
                                      >
                                        {col.type === "checkbox" ? (
                                          row[col.columnId] ? (
                                            <Check className="w-4 h-4 text-green-500" />
                                          ) : (
                                            <X className="w-4 h-4 text-red-500" />
                                          )
                                        ) : (
                                          row[col.columnId] || "-"
                                        )}
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
            {/* --- CUSTOM REPORT FOOTER (Matches Screenshot) --- */}
            <div className="mt-12 pt-10 border-t border-gray-300 text-sm leading-relaxed">
              {/* GRID: LEFT = Signature + Name | RIGHT = NATA */}
              <div className="grid grid-cols-12 gap-8 items-start">
                {/* LEFT SIDE */}
                <div className="col-span-7 space-y-4">
                  <p className="font-semibold text-lg">Reported By:</p>

                  {/* SIGNATURE BLOCK */}
                  <div className="space-y-3">
                    <p className="font-semibold text-gray-700">Signature:</p>

                    {/* DRAW SIGNATURE */}
                    {!signature && (
                      <div>
                        <div id="onborder" className="border border-dashed border-gray-400 w-fit">
                          <SignaturePad
                            ref={sigRef}
                            penColor="black"
                            canvasProps={{
                              width: 280,
                              height: 100,
                              className: " rounded bg-white shadow-sm",
                            }}
                          />
                        </div>

                        <div className="flex gap-3 mt-3 no-print">
                          <Button variant="outline" onClick={clear}>
                            Clear
                          </Button>
                        </div>
                      </div>
                    )}
                    {signature && (
                      <div className="space-y-2">
                        <img
                          src={`${signature}`}
                          alt="saved signature"
                          className="w-48 border"
                        />
                        <Button
                          className="no-print"
                          variant="outline"
                          onClick={clear}
                        >
                          Remove Signature
                        </Button>
                      </div>
                    )}

                    {/* UPLOAD SIGNATURE */}
                    <div className="no-print">
                      <p className="text-xs text-gray-600 mb-1">
                        OR upload signature image
                      </p>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleUpload}
                        className="text-xs"
                      />
                    </div>
                  </div>

                  {/* NAME + QUALIFICATION */}
                  <div>
                    <p className="font-semibold text-base leading-tight">
                      {user?.userName}
                    </p>
                    <p className="text-sm text-gray-700 leading-tight">
                      {user?.qualification || ""}
                    </p>
                  </div>
                </div>

                {/* RIGHT SIDE — NATA */}
                <div className="col-span-5 flex flex-col items-end text-right space-y-1">
                  <img
                    src="https://eaglelighting.com.au/assets/public-assets/Nata-Text-Media-Block.jpg"
                    alt="NATA Accreditation"
                    className="w-40 object-contain mb-2"
                  />

                  <p className="text-xs">
                    Accreditation No. <strong>20974</strong>
                  </p>
                  <p className="text-xs">Accredited for compliance with</p>
                  <p className="text-xs font-semibold">ISO/IEC 17025</p>
                  <p className="text-xs">TESTING</p>
                </div>
              </div>

              {/* NOTES SECTION */}
              <div className="mt-10 text-xs italic text-gray-700 leading-5">
                <p>
                  The results contained in this report are based on measurements
                  and observations made at the time of testing and apply only to
                  the items tested. NDT Plus assumes all information provided by
                  the client is correct. NDT Plus is not responsible for test
                  results that are based on inaccurate or misleading information
                  provided by the client. Client-supplied information is
                  indicated with ^. Measurement Uncertainty (MU) – Binary
                  decision rule applied as per NDT quality procedure QMP-PRO-08
                  where conformance statements are required. This report is not
                  to be reproduced except in full.
                </p>
              </div>
            </div>

            {/* Page Footer */}
            <div className="mt-8 pt-4 border-t border-gray-300 text-center text-xs text-gray-500">
              <p>
                Generated on: {new Date(record.updatedAt).toLocaleDateString()}{" "}
                {new Date(record.updatedAt).toLocaleTimeString()}
              </p>
              {/* <p className="mt-2">Page 1 of 1</p> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
