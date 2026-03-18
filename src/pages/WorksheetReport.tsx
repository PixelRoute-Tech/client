import { useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useReactToPrint } from "react-to-print";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Printer, Check, X, Image } from "lucide-react";
import {
  ImageRecord,
  Worksheet,
  WorksheetField,
  WorksheetRecord,
} from "@/types/worksheet.type";
import { useQuery } from "@tanstack/react-query";
import {
  getRecordData,
  JobRequestTemp,
} from "@/services/worksheet.services";
import { useToast } from "@/hooks/use-toast";
import SignaturePad from "react-signature-canvas";
import moment from "moment";
import { useAuth } from "@/hooks/useAuth";
import { ClientType } from "@/types/client.type";
import { UserType } from "@/types/auth";
import "../styles/print.css";
import routes from "@/routes/routeList";
import { baseURL } from "@/config/network.config";

interface TableRenderData {
  field: WorksheetField;
  data: any[];
  sectionName: string;
}

export default function WorksheetReport() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const printRef = useRef<HTMLDivElement>(null);
  const [signature, setSignature] = useState<string | ArrayBuffer>("");

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: "NDTP-Inspection-Report",
  });

  const createReportNo = () => {
    if (client?.id && jobData?.id && jobData?.from_date) {
      const set1 = parseInt(String(client.id).replace(/\D/g, "") || "0", 10);
      const set2 = parseInt(String(jobData.id).replace(/\D/g, "") || "0", 10);
      const set3 = moment(jobData.from_date).format("DD_YY");
      return `${set3}/${set1}_${set2}`;
    }
    return "N/A";
  };

  const { data: result, isLoading: loadingData } = useQuery({
    queryKey: [`${id}forworksheetreport`, id],
    queryFn: async () => getRecordData(id!),
  });

  const reportData = result?.data?.[0];
  const record = reportData?.record;
  const worksheet = reportData?.worksheet;
  const client = reportData?.client;
  const jobData = reportData?.job;
  const technician = reportData?.technician;
  const images = reportData?.images || [];

  const sigRef = useRef<any>(null);

  const clear = () => {
    sigRef.current?.clear();
    setSignature("");
  };

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setSignature(reader.result || "");
      };
      reader.readAsDataURL(file);
    }
  };

  if (loadingData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-lg font-medium text-muted-foreground animate-pulse">
            Loading Report...
          </p>
        </div>
      </div>
    );
  }

  if (!worksheet || !record || !client || !jobData || !technician) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center glass-panel p-12 max-w-md">
          <h2 className="text-2xl font-bold text-foreground mb-4">
            Report Data Missing or Not Found
          </h2>
          <p className="text-muted-foreground mb-8">
            We couldn't retrieve the data for this report. It might have been deleted or the link is invalid.
          </p>
          <Button onClick={() => navigate(-1)} className="w-full">
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  const hnadleImageData = () => {
    navigate(
      `${routes.reportImages}/${record.record_id}?worksheet=${worksheet.name}&jobid=${jobData.id}&worksheetid=${worksheet.worksheet_id}&clientname=${client.business_name}`
    );
  };

  const data = record.data;

  const renderFieldValue = (field: WorksheetField) => {
    const value = data[field.field_id];

    switch (field.type) {
      case "checkbox":
        return value ? "Yes" : "No";
      case "autocomplete-chips":
        return Array.isArray(value) ? value.join(", ") : "-";
      case "file":
        return value || " ";
      case "table":
        return null;
      default:
        return value || " ";
    }
  };

  const setUpUrl = (url: string) => {
    if (url.includes("http")) {
      return url;
    } else {
      return `${baseURL}${url}`;
    }
  };

  const tableSections: TableRenderData[] = [];

  return (
    <div className="min-h-screen bg-muted/30 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-6 no-print">
          <Button
            variant="outline"
            onClick={() => navigate(-1)}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <div className="flex items-center justify-center gap-3">
            <Button
              variant="outline"
              onClick={hnadleImageData}
              className="gap-2"
            >
              <Image className="h-4 w-4" />
              Add images
            </Button>
            <Button onClick={handlePrint} className="gap-2">
              <Printer className="h-4 w-4" />
              Print Report
            </Button>
          </div>
        </div>

        <div ref={printRef} className="bg-white printable-report-container">
          <div className="p-4">
            <div className="border-b-2 border-gray-800 grid grid-cols-12 items-center mb-6 pb-2 avoid-break">
              <div className="flex items-center gap-4 col-span-3">
                <div className="w-24 h-24 border-2 border-gray-300 flex items-center justify-center text-xs text-gray-500">
                  <img
                    src={user?.company?.logo}
                    alt="Logo"
                    className="max-h-full max-w-full object-contain"
                  />
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

              <div className="py-6 col-span-6 ">
                <h2 className="underline text-center text-xl font-bold text-gray-900 uppercase tracking-wide">
                  {worksheet?.name}
                </h2>
              </div>

              <div className="text-right text-xs text-gray-700 col-span-3">
                <p className="font-semibold">{user?.company?.lisenceNo}</p>
                <p className="text-blue-600">{user?.company?.email}</p>
                <p>{user?.company?.contactNo}</p>
              </div>
            </div>

            <div className="space-y-2 grid grid-cols-2 mb-3 avoid-break">
              <div className="grid grid-cols-3 gap-4 text-sm avoid-break">
                <div className="font-bold text-gray-900 break-words">
                  Job description
                </div>
                <div className="col-span-2 text-gray-700 break-words">
                  : {worksheet?.description}
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4 text-sm avoid-break">
                <div className="font-bold text-gray-900 break-words">
                  Report no
                </div>
                <div className="col-span-2 text-gray-700 break-words">
                  : {createReportNo()}
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4 text-sm avoid-break">
                <div className="font-bold text-gray-900 break-words">
                  Client
                </div>
                <div className="col-span-2 text-gray-700 break-words">
                  : {client?.business_name}
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4 text-sm avoid-break">
                <div className="font-bold text-gray-900 break-words">
                  Report date
                </div>
                <div className="col-span-2 text-gray-700 break-words">
                  : {moment().format("DD-MM-YYYY")}
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4 text-sm avoid-break">
                <div className="font-bold text-gray-900 break-words">
                  Address
                </div>
                <div className="col-span-2 text-gray-700 break-words">
                  : {client?.business_address}
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4 text-sm avoid-break">
                <div className="font-bold text-gray-900 break-words">
                  Job no
                </div>
                <div className="col-span-2 text-gray-700 break-words">
                  : {jobData?.id}
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4 text-sm avoid-break">
                <div className="font-bold text-gray-900 break-words">
                  Job address
                </div>
                <div className="col-span-2 text-gray-700 break-words">
                  : {client?.business_address}
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4 text-sm avoid-break">
                <div className="font-bold text-gray-900 break-words">
                  P/O no
                </div>
                <div className="col-span-2 text-gray-700 break-words">
                  : {client?.postal_address}
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4 text-sm avoid-break">
                <div className="font-bold text-gray-900 break-words">
                  Client job no
                </div>
                <div className="col-span-2 text-gray-700 break-words">
                  : {jobData?.id?.slice(3)}
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4 text-sm avoid-break">
                <div className="font-bold text-gray-900 break-words">
                  Attention
                </div>
                <div className="col-span-2 text-gray-700 break-words">
                  : {technician?.userName}
                </div>
              </div>
              <div className="col-span-full"></div>
            </div>

            <div className="space-y-2 grid grid-cols-2 my-3 avoid-break">
              <div className="grid grid-cols-3 gap-4 text-sm avoid-break">
                <div className="font-bold text-gray-900 break-words">
                  Technician
                </div>
                <div className="col-span-2 text-gray-700 break-words">
                  : {user?.userName}
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4 text-sm avoid-break">
                <div className="font-bold text-gray-900 break-words">
                  Date of Inspection
                </div>
                <div className="col-span-2 text-gray-700 break-words">
                  : {moment().format("DD-MM-YYYY")}
                </div>
              </div>
            </div>

            <hr className="my-3 border-gray-300" />

            {worksheet?.sections?.map((section, sectionIndex) => (
              <div key={section.section_id} className="mb-8 avoid-break">
                <div className="space-y-2 grid grid-cols-2">
                  {section?.fields?.map((field) => {
                    if (field.type === "table") {
                      const tableData = data[field.field_id] || [];
                      if (tableData.length > 0) {
                        tableSections.push({
                          field,
                          data: tableData,
                          sectionName: section.name,
                        });
                      }
                      return null;
                    }

                    return (
                      field.in_report ? <div
                        key={field.field_id}
                        className="grid grid-cols-3 gap-4 text-sm items-end justify-start avoid-break"
                      >
                        <div className="font-bold text-gray-900 break-words">
                          {field.name}
                        </div>
                        <div className="col-span-2 text-gray-700 break-words">
                          : {renderFieldValue(field)}
                        </div>
                      </div> : null
                    );
                  })}
                </div>
                {sectionIndex < worksheet.sections.length - 1 && (
                  <hr className="mt-6 border-gray-300" />
                )}
              </div>
            ))}

            <div className="mt-12 pt-10 border-t border-gray-300 text-sm leading-relaxed avoid-break">
              <div className="grid grid-cols-12 gap-8 items-start">
                <div className="col-span-7 space-y-4">
                  <p className="font-semibold text-lg">Reported By:</p>
                  <div className="space-y-3">
                    <p className="font-semibold text-gray-700">Signature:</p>
                    {(!signature || sigRef.current) && (
                      <div className="avoid-break">
                        <div
                          id="onborder"
                          className="border border-dashed border-gray-400 w-fit"
                        >
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
                    {signature && !sigRef.current && (
                      <div className="space-y-2 avoid-break">
                        <img
                          src={`${signature}`}
                          alt="saved signature"
                          className="w-48 border max-w-full h-auto"
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
                  <div className="avoid-break">
                    <p className="font-semibold text-base leading-tight">
                      {user?.userName}
                    </p>
                    <p className="text-sm text-gray-700 leading-tight">
                      {user?.qualification || ""}
                    </p>
                  </div>
                </div>
                <div className="col-span-5 flex flex-col items-end text-right space-y-1 avoid-break">
                  <img
                    src="https://eaglelighting.com.au/assets/public-assets/Nata-Text-Media-Block.jpg"
                    alt="NATA Accreditation"
                    className="w-40 object-contain mb-2 max-w-full h-auto"
                  />
                  <p className="text-xs">
                    Accreditation No. <strong>20974</strong>
                  </p>
                  <p className="text-xs">Accredited for compliance with</p>
                  <p className="text-xs font-semibold">ISO/IEC 17025</p>
                  <p className="text-xs">TESTING</p>
                </div>
              </div>
              <div className="mt-10 text-xs italic text-gray-700 leading-5 avoid-break">
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

            <div className="mt-8 pt-4 border-t border-gray-300 text-center text-xs text-gray-500 avoid-break">
              <p>
                Generated on: {record.updated_at ? new Date(record.updated_at).toLocaleDateString() : 'N/A'}{" "}
                {record.updated_at ? new Date(record.updated_at).toLocaleTimeString() : ''}
              </p>
            </div>
          </div>

          {tableSections.length > 0 && (
            <div className="p-6">
              <h3 className="underline text-center font-bold text-lg my-6 avoid-break">
                Detailed Data Tables
              </h3>
              {tableSections.map(({ field, data: tableData, sectionName }) => (
                <div
                  key={field.field_id}
                  className="mt-6 col-span-full avoid-break"
                >
                  <h4 className="font-bold text-sm text-gray-900 mb-2 avoid-break">
                    {sectionName} - {field.name}:
                  </h4>
                  <table className="w-full border-collapse border border-gray-400 text-xs">
                    <thead>
                      <tr className="bg-gray-200">
                        {field.table_columns?.map((col) => (
                          <th
                            key={col.column_id}
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
                          {field.table_columns?.map((col) => (
                            <td
                              key={col.column_id}
                              className="border border-gray-400 px-3 py-2"
                            >
                              {col.type === "checkbox" ? (
                                row[col.column_id] ? (
                                  <Check className="w-4 h-4 text-green-500" />
                                ) : (
                                  <X className="w-4 h-4 text-red-500" />
                                )
                              ) : (
                                row[col.column_id] || " "
                              )}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ))}
            </div>
          )}

          {images?.length > 0 && (
            <div className="p-6 avoid-break">
              <h4 className="underline text-center font-bold my-6">
                Photographs
              </h4>
              <div className="pt-5 grid grid-cols-2 gap-4">
                {images.map((imag, index) => (
                  <div
                    key={index}
                    className={`flex flex-col gap-2 border rounded shadow-sm avoid-break ${
                      imag.type === "Drawing" ? "col-span-full" : ""
                    }`}
                    style={{ breakInside: "avoid", pageBreakInside: "avoid" }}
                  >
                    <div
                      className={ 
                        imag.type === "Drawing"
                          ? "p-2 h-[450px]"
                          : "p-2 h-[350px]"
                      }
                    >
                      <img
                        src={setUpUrl(imag.preview)}
                        alt={`Image ${index + 1}: ${imag.description || "N/A"}`}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    {imag.description && (
                      <div className="text-sm p-2 border-t bg-gray-50 avoid-break">
                        {imag.description}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
