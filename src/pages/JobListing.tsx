import { useState } from "react";
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
import { RotateCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useDroppable } from "@dnd-kit/core";
import { Job } from "@/types/job.type";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { getJobByUser, updateJobData } from "@/services/job.services";
const statusCheck = {
  Pending: "pending",
  "In progress": "inProgress",
  Completed: "inProgress",
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
  const [activeJob, setActiveJob] = useState<Job | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const { data: userJobList,refetch,isLoading } = useQuery({
    queryKey: ["joblistbyuserid", user?.id],
    queryFn: async () => getJobByUser(user?.id),
  });

  const { mutate: statusChange } = useMutation({
    mutationFn: updateJobData,
    onSuccess: (result) => {
      if (result.success) {
        queryClient.setQueryData(
          [`joblistbyuserid${user?.id}`, user?.id],
          (prev: any) => result
        );
        toast({
          title: "Status Updated",
          description: `Job moved to ${result.message}`,
        });
      }
    },
    onError: (e: any) => {
      refetch()
      toast({
        title: "Error",
        description: e?.message || "Something went wrong",
      });
    },
  });

  const handleDragStart = (event: DragStartEvent) => {
    const containerId = event?.active?.data.current?.sortable?.containerId;
    let job = null;
    if (containerId == "Pending") {
      job = userJobList?.data?.pending?.find((j) => j._id === event.active.id);
    }
    if (containerId == "In progress") {
      job = userJobList?.data?.inProgress?.find(
        (j) => j._id === event.active.id
      );
    }
    if (containerId == "Completed") {
      job = userJobList?.data?.completed?.find(
        (j) => j._id === event.active.id
      );
    }
    setActiveJob(job);
    console.log("Dragging:", event.active);
  };

  const handleDragChange = (newStatus: keyof typeof statusCheck, obj: Job) => {
    let pending = [...userJobList.data.pending];
    let inProgress = [...userJobList.data.inProgress];
    let completed = [...userJobList.data.completed];
    if (newStatus == "Pending") {
      pending = [obj, ...pending];
      inProgress = inProgress.filter((i) => i._id != obj._id);
      completed = completed.filter((i) => i._id != obj._id);
    }
    if (newStatus == "In progress") {
      pending = pending.filter((i) => i._id != obj._id);
      inProgress = [obj, ...inProgress];
      completed = completed.filter((i) => i._id != obj._id);
    }
    if (newStatus == "Completed") {
      pending = pending.filter((i) => i._id != obj._id);
      inProgress = inProgress.filter((i) => i._id != obj._id);
      completed = [obj, ...completed];
    }

    queryClient.setQueryData(["joblistbyuserid", user?.id], (prev: any) => ({
      ...userJobList,
      data: { pending, inProgress, completed },
    }));
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveJob(null);
    if (!over) return;
    let activeJob = null;

    if (active?.data.current?.sortable?.containerId == "Pending") {
      activeJob = userJobList?.data?.pending?.find((j) => j._id === active.id);
    }
    if (active?.data.current?.sortable?.containerId == "In progress") {
      activeJob = userJobList?.data?.inProgress?.find(
        (j) => j._id === active.id
      );
    }
    if (active?.data.current?.sortable?.containerId == "Completed") {
      activeJob = userJobList?.data?.completed?.find(
        (j) => j._id === active.id
      );
    }

    if (!activeJob) return;
    const newStatus = over.id as Job["status"];

    if (activeJob.status !== newStatus && statusCheck[newStatus]) {
      activeJob = { ...activeJob, status: newStatus };
      statusChange(activeJob);
      handleDragChange(newStatus, activeJob);
    }
  };

  const handleRefresh = ()=>{
     refetch()
  }

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
          <div className="flex justify-between items-center w-full">
           <div>
             <h1 className="text-3xl font-bold">Job Listing</h1> 
            <p className="text-muted-foreground">Manage and track your jobs</p>
           </div>

            <Button loading={isLoading} size="sm" onClick={handleRefresh}>Refresh <RotateCw /></Button>
          </div>
 
          {/* <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
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
          </Dialog> */}
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
                      {column.id == "Pending" &&
                        `${userJobList?.data?.pending?.length || 0} ${
                          userJobList?.data?.pending?.length > 1
                            ? "Jobs"
                            : "Job"
                        }`}
                      {column.id == "In progress" &&
                        `${userJobList?.data?.inProgress?.length || 0} ${
                          userJobList?.data?.inProgress?.length > 1
                            ? "Jobs"
                            : "Job"
                        }`}
                      {column.id == "Completed" &&
                        `${userJobList?.data?.completed?.length || 0} ${
                          userJobList?.data?.completed?.length > 1
                            ? "Jobs"
                            : "Job"
                        }`}
                    </span>
                  </div>

                  <SortableContext
                    items={[]}
                    strategy={verticalListSortingStrategy}
                    id={column.id}
                  >
                    <ScrollArea className="h-[calc(100vh-280px)]">
                      <div className="space-y-3 pr-4">
                        {column.id == "Pending" &&
                          userJobList?.data?.pending?.map((job) => (
                            <JobCard key={job._id} job={job} />
                          ))}
                        {column.id == "In progress" &&
                          userJobList?.data?.inProgress?.map((job) => (
                            <JobCard key={job._id} job={job} />
                          ))}
                        {column.id == "Completed" &&
                          userJobList?.data?.completed?.map((job) => (
                            <JobCard key={job._id} job={job} />
                          ))}
                        {Boolean(
                          userJobList?.data?.pending?.length === 0 &&
                            column.id == "Pending"
                        ) && (
                          <div className="text-center py-8 text-muted-foreground text-sm">
                            No jobs in {column.id}
                          </div>
                        )}
                        {Boolean(
                          userJobList?.data?.inProgress?.length === 0 &&
                            column.id == "In progress"
                        ) && (
                          <div className="text-center py-8 text-muted-foreground text-sm">
                            No jobs in {column.id}
                          </div>
                        )}
                        {Boolean(
                          userJobList?.data?.completed?.length === 0 &&
                            column.id == "Completed"
                        ) && (
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
