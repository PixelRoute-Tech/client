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
import { getItem, setItem, storageKeys } from "@/utils/storage";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Clipboard, X } from "lucide-react";

function WorksheetDetails() {
  const [searchParams] = useSearchParams();
  const sheetid = searchParams.get("sheetid");
  const jobid = searchParams.get("jobid");
  const clientId = searchParams.get("clientId");
  const recordId = `record_${jobid}_${sheetid}`;
  const [openModal, setOpenModal] = useState<boolean>();
  const queryClient = useQueryClient();
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

  const handleCancel = (status: boolean | any) => {
    const copiedData = getItem(storageKeys.copied);
    delete copiedData[sheetid];
    setItem(storageKeys.copied, copiedData);
    if (typeof status == "boolean") {
      setOpenModal(status);
    } else {
      setOpenModal(false);
    }
  };

  const handlePaste = () => {
    const copiedData = getItem(storageKeys.copied);
    queryClient.setQueryData([recordId, sheetid], {data:copiedData[sheetid],message:"OK",status:200});
    delete copiedData[sheetid];
    setItem(storageKeys.copied, copiedData);
    setOpenModal(false);
  };

  useEffect(() => {
    const sheetData = getItem(storageKeys.copied);
    if (sheetData[sheetid]) {
      setOpenModal(true);
    }
  }, []);
 

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
      <Dialog open={openModal} onOpenChange={handleCancel}>
        <DialogContent className="max-w-2xl overflow-y-auto p-0">
          <DialogHeader className="p-3">
            <DialogTitle>Paste copied data</DialogTitle>
          </DialogHeader>
          <div className="py-5 px-3">Do you want to past the copied data</div>
          <div className="flex justify-end items-center py-4 px-2 gap-3 border-t">
            <Button size="sm" onClick={handlePaste}>
              Paste <Clipboard />
            </Button>
            <Button size="sm" variant="destructive" onClick={handleCancel}>
              Cancel <X />
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default WorksheetDetails;
