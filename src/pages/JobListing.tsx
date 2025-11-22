import { useState, useEffect } from "react";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import { JobCard } from "@/components/JobCard";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";
import { jobStorage } from "@/utils/jobStorage";
import { useDroppable } from "@dnd-kit/core";
import { Job } from "@/types/job.type";
const statusCheck = {
  Pending: true,
  "In progress": true,
  Completed: true,
};
function DroppableColumn({ id, children }: any) {
  const { setNodeRef } = useDroppable({ id });

  return (
    <div ref={setNodeRef} className="h-full">
      {children}
    </div>
  );
}
export default function JobListing() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [activeJob, setActiveJob] = useState<Job | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  useEffect(() => {
    setJobs(jobStorage.getAll());
  }, []);

  const handleDragStart = (event: DragStartEvent) => {
    const job = jobs.find((j) => j.jobId === event.active.id);
    setActiveJob(job || null);
    console.log("Dragging:", event.active);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveJob(null);
    if (!over) return;
    const activeJob = jobs.find((j) => j.jobId === active.id);
    if (!activeJob) return;
    const newStatus = over.id as Job["status"];
    if (activeJob.status !== newStatus && statusCheck[newStatus]) {
      jobStorage.updateStatus(activeJob.jobId, newStatus);
      setJobs(jobStorage.getAll());

      toast({
        title: "Status Updated",
        description: `Job moved to ${newStatus.replace("-", " ")}`,
      });
    }
  };

  // const handleDragOver = (event: any) => {
  //   const { active, over } = event;
  //   if (!over) return;

  //   console.log(`Hovering job over → ${over.id}`);
  // };

  const handleAddJob = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const newJob = jobStorage.save({
      jobId: "JOB00047",
      testMethod: formData.get("workName") as string,
      testSpec: "test spec",
      acceptanceSpec: "jgjhgfjh",
      toTable: "weqr",
      testProcedure: "test procedure",
      tech: "ERP00003",
      status: "Pending",
      createdAt: "2025-11-22T11:54:47.629Z",
      updatedAt: "2025-11-22T11:54:47.629Z",
    });

    setJobs(jobStorage.getAll());
    setIsDialogOpen(false);

    toast({
      title: "Job Created",
      description: `${newJob.testMethod} has been added`,
    });
  };

  const getJobsByStatus = (status: Job["status"]) => {
    return jobs.filter((job) => job.status === status);
  };

  const columns: { id: Job["status"]; color: string }[] = [
    {
      id: "Pending",
      color: "bg-secondary/10 border-secondary",
    },
    {
      id: "In progress",
      color: "bg-primary/10 border-primary",
    },
    {
      id: "Completed",
      color: "bg-success/10 border-success",
    },
  ];

  return (
    <>
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Job Listing</h1>
            <p className="text-muted-foreground">Manage and track your jobs</p>
          </div>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Job
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Job</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleAddJob} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="workName">Work Name</Label>
                  <Input
                    id="workName"
                    name="workName"
                    placeholder="Enter work name"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="assignedDate">Assigned Date</Label>
                  <Input
                    id="assignedDate"
                    name="assignedDate"
                    type="date"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastDate">Due Date</Label>
                  <Input id="lastDate" name="lastDate" type="date" required />
                </div>
                <Button type="submit" className="w-full">
                  Create Job
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <DndContext
          sensors={sensors}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          //   onDragOver={handleDragOver}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {columns.map((column) => (
              <DroppableColumn key={column.id} id={column.id}>
                <div
                  key={column.id}
                  className={`rounded-lg border-2 ${column.color} p-4 space-y-4`}
                >
                  <div className="flex items-center justify-between">
                    <h2 className="font-semibold text-lg">{column.id}</h2>
                    <span className="text-sm text-muted-foreground">
                      {getJobsByStatus(column.id).length} jobs
                    </span>
                  </div>

                  <SortableContext
                    items={getJobsByStatus(column.id).map((j) => j.jobId)}
                    strategy={verticalListSortingStrategy}
                    id={column.id}
                  >
                    <ScrollArea className="h-[calc(100vh-280px)]">
                      <div className="space-y-3 pr-4">
                        {getJobsByStatus(column.id).map((job) => (
                          <JobCard key={job.jobId} job={job} />
                        ))}
                        {getJobsByStatus(column.id).length === 0 && (
                          <div className="text-center py-8 text-muted-foreground text-sm">
                            No jobs in {column.id}
                          </div>
                        )}
                      </div>
                    </ScrollArea>
                  </SortableContext>
                </div>
              </DroppableColumn>
            ))}
          </div>

          <DragOverlay>
            {activeJob ? <JobCard job={activeJob} /> : null}
          </DragOverlay>
        </DndContext>
      </div>
    </>
  );
}
