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
import { X } from "lucide-react";
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
      <div className="container mx-auto py-10 text-center page-transition">
        <div className="glass-panel p-10 max-w-md mx-auto border-red-500/20">
          <h2 className="text-2xl font-light text-red-500 mb-4">No Worksheet ID provided</h2>
          <Button onClick={() => navigate(-1)} variant="outline" className="btn-press">Go Back</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 space-y-8 page-transition">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 glass-panel p-6 shadow-xl border-white/10">
        <div>
          <h1 className="text-3xl font-light tracking-tight text-primary-white">Worksheet Details</h1>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2">
            <p className="text-muted-white text-sm">
              Job: <span className="font-medium text-primary-white">{jobid || "N/A"}</span>
            </p>
            <div className="w-1.5 h-1.5 rounded-full bg-border" />
            <p className="text-muted-white text-sm">
              Record ID: <span className="font-medium text-primary-white truncate inline-block max-w-[200px] align-bottom">{recordId}</span>
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={() => navigate(-1)} size="sm" className="hover-lift btn-press border-white/20 bg-white/5 backdrop-blur-sm">
            Back
          </Button>
          <Button variant="secondary" onClick={handleCopy} size="sm" className="hover-lift btn-press bg-white/10 hover:bg-white/20 border-white/10 text-primary-white">
            Copy Previous
          </Button>
          <Button 
            onClick={handleShowReport} 
            size="sm" 
            className="hover-lift btn-press bg-primary hover:bg-primary-hover text-white shadow-lg shadow-primary/20"
            disabled={!record?.data}
          >
            View Report
          </Button>
        </div>
      </div>

      {worksheetLoading || recordLoading ? (
        <div className="glass-panel p-8">
          <SkeletonLoader config={skeletonConfigs.form} />
        </div>
      ) : worksheet?.data ? (
        <div className="glass-elevated rounded-2xl p-0.5 border border-white/5 overflow-hidden">
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
        <div className="flex flex-col items-center justify-center py-20 glass-panel border-red-500/20 text-center">
          <div className="p-4 rounded-full bg-red-500/10 mb-4">
            <X className="h-8 w-8 text-red-500" />
          </div>
          <h3 className="text-2xl font-light text-red-500 mb-2">Error Loading Worksheet</h3>
          <p className="text-muted-white max-w-md mx-auto mb-8">{worksheetError instanceof Error ? worksheetError.message : "We couldn't retrieve the worksheet configuration or record data."}</p>
          <Button variant="outline" onClick={() => window.location.reload()} className="hover-lift btn-press border-white/20">Try Again</Button>
        </div>
      )}
    </div>
  );
}

export default WorksheetDetails;
