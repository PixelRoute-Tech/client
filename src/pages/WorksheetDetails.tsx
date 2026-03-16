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
import { useNavigate, useSearchParams } from "react-router-dom";

function WorksheetDetails() {
  const [searchParams] = useSearchParams();
  const sheetid = searchParams.get("sheetid");
  const jobid = searchParams.get("jobid");
  const clientId = searchParams.get("clientId");
  const recordId = `record_${jobid}_${sheetid}`;
  const { data: worksheet, isLoading: worksheetLoading } = useQuery({
    queryKey: ["worksheetdatafordetails", sheetid],
    queryFn: async () => getWorkSheet(sheetid),
    enabled: Boolean(sheetid),
    refetchOnWindowFocus: false,
  });
  const { data: record, isLoading: recordLoading } = useQuery({
    queryKey: [recordId, sheetid],
    queryFn: async () => getRecord(recordId),
    enabled: Boolean(sheetid),
    refetchOnWindowFocus: false,
    retry: 2,
  });

  const navigate = useNavigate();
  const handleShowReport = () => {
    navigate(`${routes.worksheetReport}/${recordId}`);
  };
  const handleCopy = () => {
    navigate(`${routes.previousReport}/${sheetid}`);
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Worksheet Details</h1>
          <p className="text-slate-500 text-sm">
            Job: <span className="font-medium text-slate-700">{jobid}</span> • 
            Record: <span className="font-medium text-slate-700">{recordId}</span>
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => navigate(-1)} size="sm">
            Back
          </Button>
          <Button variant="secondary" onClick={handleCopy} size="sm">
            Copy Previous
          </Button>
          <Button onClick={handleShowReport} size="sm" className="bg-indigo-600 hover:bg-indigo-700">
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
            data={record?.data?.data?.data || {}}
            worksheet={worksheet?.data}
            recordId={recordId}
            clientId={clientId || ""}
            isEdit={!!record?.data?.data}
          />
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 bg-red-50 rounded-xl border border-red-200 text-red-600">
          <h3 className="text-lg font-semibold mb-2">Error Loading Worksheet</h3>
          <p className="text-sm opacity-80 mb-6">We couldn't retrieve the worksheet configuration or record data.</p>
          <Button variant="outline" onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      )}
    </div>
  );
}

export default WorksheetDetails;
