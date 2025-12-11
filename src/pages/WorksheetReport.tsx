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
  // TechRowTemp, // Not used
} from "@/services/worksheet.services";
import { useToast } from "@/hooks/use-toast";
import SignaturePad from "react-signature-canvas";
import moment from "moment";
import { useAuth } from "@/hooks/useAuth";
import { ClientType } from "@/types/client.type";
import { UserType } from "@/types/auth";
import "../styles/print.css"; // Your print CSS is imported here
import routes from "@/routes/routeList";
import { baseURL } from "@/config/network.config";

// Interface for collecting table data to render later
interface TableRenderData {
  field: WorksheetField;
  data: any[];
  sectionName: string;
}

export default function WorksheetReport() {
  const { id } = useParams();
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();
  // Using printRef to encapsulate the content for printing
  const printRef = useRef<HTMLDivElement>(null);

  // State initialization
  const [worksheet, setWorkSheet] = useState<Worksheet>();
  const [images, setImages] = useState<ImageRecord[]>([]);
  const [technician, setTechnician] = useState<UserType>();
  const [jobData, setJobData] = useState<JobRequestTemp>();
  const [record, setRecord] = useState<WorksheetRecord>();
  const [client, setClient] = useState<ClientType>();
  const [signature, setSignature] = useState<string | ArrayBuffer>("");

  // Print handler using useReactToPrint
  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: "NDTP-Inspection-Report",
    onAfterPrint: () => {
      console.log("After print completed or print dialog was closed");
    },
  });

  // Report Number Generator
  const createReportNo = () => {
    if (client?.clientId && jobData?.jobId && jobData?.startDate) {
      // Safely parse IDs and format date
      const set1 = parseInt(client.clientId.replace(/\D/g, "") || "0", 10);
      const set2 = parseInt(jobData.jobId.replace(/\D/g, "") || "0", 10);
      const set3 = moment(jobData.startDate).format("DD_YY");
      return `${set3}/${set1}_${set2}`;
    }
    return "N/A";
  };

  // Data fetching query
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
            setTechnician(data.technician);
            setImages(data.images);
          }
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Oops! Something went wrong while loading data",
          className: "bg-red-500 text-white",
        });
      }
    },
  });

  // Signature Pad Logic
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

  if (
    loadingData ||
    !worksheet ||
    !record ||
    !client ||
    !jobData ||
    !technician
  ) {
    if (!loadingData) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-foreground mb-4">
              Report Data Missing or Not Found
            </h2>
            <Button onClick={() => navigate(-1)}>Go Back</Button>
          </div>
        </div>
      );
    }
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading Report...
      </div>
    );
  }

  // Navigate to image management route
  const hnadleImageData = () => {
    navigate(
      `${routes.reportImages}/${record.recordId}?worksheet=${worksheet.name}&jobid=${jobData.jobId}&worksheetid=${worksheet.workSheetId}&clientname=${client.businessName}`
    );
  };

  const data = record.data;

  // Function to render field values
  const renderFieldValue = (field: WorksheetField) => {
    const value = data[field.fieldId];

    switch (field.type) {
      case "checkbox":
        return value ? "Yes" : "No";
      case "autocomplete-chips":
        return Array.isArray(value) ? value.join(", ") : "-";
      case "file":
        return value || " ";
      case "table":
        return null; // Tables are rendered separately later
      default:
        return value || " ";
    }
  };

  // Helper to construct image URL
  const setUpUrl = (url: string) => {
    if (url.includes("http")) {
      return url;
    } else {
      return `${baseURL}${url}`;
    }
  };

  // 1. Array to collect table data during the map loop
  const tableSections: TableRenderData[] = [];

  return (
    <div className="min-h-screen bg-muted/30 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Action Bar (no-print) */}
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

        {/* Printable Report Container */}
        {/* Use a class to match the CSS reset rules */}
        <div ref={printRef} className="bg-white printable-report-container">
          {/* --- Main Report Content Area --- */}
          <div className="p-4">
            {/* Header */}
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
                <p>{user.company.contactNo}</p>
              </div>
            </div>

            {/* Report Details Grid */}
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
                  : {client?.businessName}
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
                  : {client?.businessAddress}
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4 text-sm avoid-break">
                <div className="font-bold text-gray-900 break-words">
                  Job no
                </div>
                <div className="col-span-2 text-gray-700 break-words">
                  : {jobData?.jobId}
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4 text-sm avoid-break">
                <div className="font-bold text-gray-900 break-words">
                  Job address
                </div>
                <div className="col-span-2 text-gray-700 break-words">
                  : {client?.businessAddress}
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4 text-sm avoid-break">
                <div className="font-bold text-gray-900 break-words">
                  P/O no
                </div>
                <div className="col-span-2 text-gray-700 break-words">
                  : {client?.postalAddress}
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4 text-sm avoid-break">
                <div className="font-bold text-gray-900 break-words">
                  Client job no
                </div>
                <div className="col-span-2 text-gray-700 break-words">
                  : {jobData?.jobId?.slice(3)}
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
                  : {user.userName}
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

            {/* --- Dynamic Fields (Non-Table) Rendering --- */}
            {worksheet?.sections?.map((section, sectionIndex) => (
              <div key={section.sectionId} className="mb-8 avoid-break">
                {/* Section Fields */}
                <div className="space-y-2 grid grid-cols-2">
                  {section?.fields?.map((field) => {
                    if (field.type === "table") {
                      const tableData = data[field.fieldId] || [];
                      if (tableData.length > 0) {
                        // 2. COLLECT TABLE DATA for rendering later
                        tableSections.push({
                          field,
                          data: tableData,
                          sectionName: section.name,
                        });
                      }
                      return null; // DO NOT RENDER TABLE HERE
                    }

                    return (
                      <div
                        key={field.fieldId}
                        className="grid grid-cols-3 gap-4 text-sm items-end justify-start avoid-break"
                      >
                        <div className="font-bold text-gray-900 break-words">
                          {field.name}
                        </div>
                        <div className="col-span-2 text-gray-700 break-words">
                          : {renderFieldValue(field)}
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

            {/* --- Report Footer (Signature/NATA) --- */}
            <div className="mt-12 pt-10 border-t border-gray-300 text-sm leading-relaxed avoid-break">
              <div className="grid grid-cols-12 gap-8 items-start">
                {/* LEFT SIDE: Signature Block */}
                <div className="col-span-7 space-y-4">
                  <p className="font-semibold text-lg">Reported By:</p>

                  <div className="space-y-3">
                    <p className="font-semibold text-gray-700">Signature:</p>

                    {/* DRAW/UPLOAD SIGNATURE */}
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
                  <div className="avoid-break">
                    <p className="font-semibold text-base leading-tight">
                      {user?.userName}
                    </p>
                    <p className="text-sm text-gray-700 leading-tight">
                      {user?.qualification || ""}
                    </p>
                  </div>
                </div>

                {/* RIGHT SIDE — NATA */}
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

              {/* NOTES SECTION */}
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

            {/* Page Footer */}
            <div className="mt-8 pt-4 border-t border-gray-300 text-center text-xs text-gray-500 avoid-break">
              <p>
                Generated on: {new Date(record.updatedAt).toLocaleDateString()}{" "}
                {new Date(record.updatedAt).toLocaleTimeString()}
              </p>
            </div>
          </div>

          {/* ---------------------------------------------------- */}
          {/* --- SECTION 1: RENDER COLLECTED TABLES AFTER FOOTER --- */}
          {/* ---------------------------------------------------- */}
          {tableSections.length > 0 && (
            <div className="p-6">
              <h3 className="underline text-center font-bold text-lg my-6 avoid-break">
                Detailed Data Tables
              </h3>
              {tableSections.map(({ field, data: tableData, sectionName }) => (
                <div
                  key={field.fieldId}
                  className="mt-6 col-span-full avoid-break"
                >
                  <h4 className="font-bold text-sm text-gray-900 mb-2 avoid-break">
                    {sectionName} - {field.name}:
                  </h4>

                  {/* Table Rendering */}
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
                                row[col.columnId] || " "
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

          {/* ---------------------------------------------- */}
          {/* --- SECTION 2: RENDER IMAGES AFTER TABLES --- */}
          {/* ---------------------------------------------- */}
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
