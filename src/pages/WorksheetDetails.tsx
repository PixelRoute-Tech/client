import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  skeletonConfigs,
  SkeletonLoader,
} from "@/components/ui/skeleton-loader";
import { WorksheetRenderer } from "@/components/worksheet/WorksheetRenderer";
import routes from "@/routes/routeList";
import { getRecord, getWorkSheet } from "@/services/worksheet.services";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

function WorksheetDetails() {
  const [searchParams] = useSearchParams();
  const sheetid = searchParams.get("sheetid");
  const rawJobid = searchParams.get("jobid");
  const rawClientId = searchParams.get("clientId");

  const jobid = (rawJobid === "undefined" || !rawJobid) ? "" : rawJobid;
  const clientId = (rawClientId === "undefined" || !rawClientId) ? "" : rawClientId;

  // Use the derived jobid and sheetid to form a unique record identifier
  const recordId = `record_${jobid || "temp"}_${sheetid}`;
  const tempRecordId = `record_temp_${sheetid}`;

  const { data: worksheet, isLoading: worksheetLoading, error: worksheetError } = useQuery({
    queryKey: ["worksheetdatafordetails", sheetid],
    queryFn: async () => getWorkSheet(sheetid!),
    enabled: Boolean(sheetid),
    refetchOnWindowFocus: false,
  });

  const { data: record, isLoading: recordLoading } = useQuery({
    queryKey: [recordId, sheetid],
    queryFn: async () => {
      // 1. Try to get the job-specific record
      const result = await getRecord(recordId);
      
      // 2. If not found and we have a real jobid, try to get the 'temp' record
      if (!result?.data && jobid && jobid !== "temp") {
        console.log("[WorksheetDetails] Job-specific record not found, checking for temp record...");
        const tempResult = await getRecord(tempRecordId);
        if (tempResult?.data) {
          console.log("[WorksheetDetails] Found temp record, will migrate upon save.");
          // Return the temp record but the component will know to save it as the new ID
          return tempResult;
        }
      }
      return result;
    },
    enabled: Boolean(sheetid) && Boolean(recordId),
    refetchOnWindowFocus: false,
    retry: 1,
  });

  const navigate = useNavigate();
  const handleShowReport = () => {
    navigate(`${routes.worksheetReport}/${recordId}`);
  };
  const handleCopy = () => {
    navigate(`${routes.previousReport}/${sheetid}`);
  };

  useEffect(() => {
    if (record) {
      console.log("[WorksheetDetails] Record state:", {
        recordId,
        hasData: !!record?.data,
        formData: record?.data?.data,
      });
    }
  }, [record, recordId]);

  if (!sheetid) {
    return (
      <div className="container mx-auto py-10 text-center">
        <h2 className="text-xl font-semibold text-red-600">No Worksheet ID provided</h2>
        <Button onClick={() => navigate(-1)} className="mt-4">Go Back</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Worksheet Details</h1>
          <p className="text-slate-500 text-sm">
            Job: <span className="font-medium text-slate-700">{jobid || "N/A"}</span> • 
            Record: <span className="font-medium text-slate-700 truncate inline-block max-w-[200px] align-bottom">{recordId}</span>
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => navigate(-1)} size="sm">
            Back
          </Button>
          <Button variant="secondary" onClick={handleCopy} size="sm">
            Copy Previous
          </Button>
          <Button 
            onClick={handleShowReport} 
            size="sm" 
            className="bg-indigo-600 hover:bg-indigo-700"
            disabled={!record?.data}
          >
            View Report
          </Button>
        </div>
      </div>

      {worksheetLoading || recordLoading ? (
        <div className="space-y-4">
          <SkeletonLoader config={skeletonConfigs.form} />
        </div>
      ) : worksheet?.data ? (
        <div className="bg-slate-50 rounded-xl p-1">
          <WorksheetRenderer
            data={record?.data?.data || {}}
            worksheet={worksheet?.data}
            recordId={recordId}
            jobId={jobid}
            clientId={clientId || ""}
            isEdit={record?.data?.record_id === recordId}
          />
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 bg-red-50 rounded-xl border border-red-200 text-red-600">
          <h3 className="text-lg font-semibold mb-2">Error Loading Worksheet</h3>
          <p className="text-sm opacity-80 mb-6">{worksheetError instanceof Error ? worksheetError.message : "We couldn't retrieve the worksheet configuration or record data."}</p>
          <Button variant="outline" onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      )}
    </div>
  );
}

export default WorksheetDetails;
