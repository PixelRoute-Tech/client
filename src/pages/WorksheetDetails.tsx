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
  const handleCpoy = () => {
    navigate(`${routes.previousReport}/${sheetid}`);
  };

  return (
    <div className="p-1">
      <div className="flex justify-end items-center gap-3 p-2">
        <Button variant="outline" onClick={handleCpoy}>
          Copy data
        </Button>
        <Button onClick={handleShowReport}>Report</Button>
      </div>
      {worksheetLoading && "Fetching data"}
      {worksheet?.data && !worksheetLoading && !recordLoading ? (
        <WorksheetRenderer
          data={record?.data?.data || {}}
          worksheet={worksheet?.data}
          recordId={recordId}
          clientId={clientId}
        />
      ) : worksheetLoading || recordLoading ? (
        <SkeletonLoader config={skeletonConfigs.form} />
      ) : (
        <div className="text-red-600 bg-red-50 p-3 rounded-md border border-red-300">
          Failed to load worksheet data. Please try again.
        </div>
      )}
   
    </div>
  );
}

export default WorksheetDetails;
