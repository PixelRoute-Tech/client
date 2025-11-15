import { WorksheetRenderer } from "@/components/worksheet/WorksheetRenderer";
import { getRecord, getWorkSheet } from "@/services/worksheet.services";
import { useQuery } from "@tanstack/react-query";
import { Button } from "react-day-picker";
import { useSearchParams } from "react-router-dom";

function WorksheetDetails() {
  const [searchParams] = useSearchParams();
  const sheetid = searchParams.get("sheetid");
  const jobid = searchParams.get("jobid");
  const recordId = `record_${jobid}_${sheetid}`
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
  });
  return (
    <div className="p-1">
      <div className="flex justify-end items-center">
        <Button>Report</Button>
      </div>
      {worksheetLoading && "Fetching data"}
      {(worksheet?.data && !worksheetLoading) ? (
        <WorksheetRenderer  data={record?.data?.data} worksheet={worksheet.data} recordId={recordId}/>
      ) : (
        "Error to fetch the worksheet data"
      )}
    </div>
  );
}

export default WorksheetDetails;
