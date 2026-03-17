import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, GripVertical, FilePenLine,FileText,Building2 } from "lucide-react";
import { format } from "date-fns";
import { Job } from "@/types/job.type";
import moment from "moment";
import routes from "@/routes/routeList";
import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";

interface JobCardProps {
  job: Job;
}

export function JobCard({ job }: JobCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: job._id });
  const navigate = useNavigate();
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const getStatusColor = (status: Job["status"]) => {
    switch (status) {
      case "Pending":
        return "secondary";
      case "In progress":
        return "default";
      case "Completed":
        return "outline";
      default:
        return "secondary";
    }
  };

  const handleEdit = () => {
    navigate(
      `${routes.worksheetDetails}?sheetid=${job.testMethod}&jobid=${job?._id}&clientId=${job.jobDetails.clientId}`
    );
  };

  const handleReport = () => {
    navigate(
      `${routes.worksheetReport}/record_${job._id}_${job.testMethod}`
    );
  };

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className="cursor-move hover:-translate-y-1 hover:shadow-[0_0_20px_hsl(var(--primary)_/_0.2)] hover:border-primary/50 transition-all duration-300 glass-elevated text-[var(--text-primary)]"
      {...attributes}
      {...listeners}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <GripVertical className="h-4 w-4 text-muted-foreground" />
              <Badge variant="outline" className="text-xs">
                {job.jobId}
              </Badge>
            </div>
            <CardTitle className="text-sm text-primary">
              {job.worksheetName}
            </CardTitle>
          </div>
          <Badge variant={getStatusColor(job.status)} className="ml-2">
            {job.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Building2 className="h-4 w-4" />
          <span>
            Client: {job.jobDetails.clientName}
          </span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4" />
          <span>
            Assigned: {moment(job.jobDetails.createdAt).format("DD MMMM YYYY")}
          </span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="h-4 w-4" />
          <span>
            Due: {moment(job.jobDetails.lastDate).format("DD MMMM YYYY")}
          </span>
        </div>
        <div className="flex justify-end">
          {job.status == "In progress" && (
            <Button onClick={handleEdit} size="sm">
              <FilePenLine />
            </Button>
          )}
          {job.status == "Completed" && (
            <Button onClick={handleReport} size="sm">
             <FileText />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
