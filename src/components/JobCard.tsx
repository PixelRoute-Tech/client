import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, GripVertical } from 'lucide-react';
import { format } from 'date-fns';
import { Job } from '@/types/job.type';

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
  } = useSortable({ id: job.jobId });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const getStatusColor = (status: Job['status']) => {
    switch (status) {
      case 'Pending':
        return 'secondary';
      case 'In progress':
        return 'default';
      case 'Completed':
        return 'outline';
      default:
        return 'secondary';
    }
  };

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className="cursor-move hover:shadow-md transition-shadow"
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
            <CardTitle className="text-lg">{job.testMethod}</CardTitle>
          </div>
          <Badge variant={getStatusColor(job.status)} className="ml-2">
            {job.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4" />
          <span>Assigned: {format(new Date(job.createdAt), 'MMM dd, yyyy')}</span>
        </div>
        {/* <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="h-4 w-4" />
          <span>Due: {format(new Date(job.lastDate), 'MMM dd, yyyy')}</span>
        </div> */}
      </CardContent>
    </Card>
  );
}
