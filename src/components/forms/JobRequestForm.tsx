import { useMemo, useState, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format } from "date-fns";
import {
  CalendarIcon,
  Plus,
  Trash2,
  Eye,
  Upload,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { useMutation, useQuery } from "@tanstack/react-query";
import { saveJobRequest, updateJobRequest } from "@/services/job.services";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { ClientType } from "@/types/client.type";
import { getWorkSheets } from "@/services/worksheet.services";
import moment from "moment";
import { getUsers } from "@/services/user.services";
import { useAuth } from "@/hooks/useAuth";
import { JobRequest, JobRequestFileList, TechRow } from "@/types/job.type";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import routes from "@/routes/routeList";
import { useNavigate } from "react-router-dom";
import { Badge } from "../ui/badge";
import { baseURL } from "@/config/network.config";

export const jobStatus = ["PENDING", "APPROVED", "REJECTED", "IN_PROGRESS", "COMPLETED", "CANCELLED"];
const initializationData = {
  startDate: new Date(),
  lastDate: new Date(),
  summary: "",
  detailsProvided: "",
  comment: "",
  timeRequired: "",
  ohsRequirements: { swms: false, jsa: false, safetyBoots: false },
  ppeRequired: {
    hardhat: false,
    bumpGap: false,
    highVis: false,
    longSleeve: false,
    safetyGlasses: false,
    safetyBoots: false,
    faceShield: false,
    weldGlass: false,
    hearingProtection: false,
    electricalProtection: false,
    respiratoryProtection: false,
  },
  equipmentList: [],
  hseProcedures: [],
  testRows: [
    {
      testMethod: "",
      testSpec: "",
      acceptanceSpec: "",
      toTable: "",
      testProcedure: "",
      tech: "",
    },
  ],
};

const dynamicStringSchema = z.object({
  value: z.string().min(1, "Required"),
});

const testRowSchema = z.object({
  testMethod: z.string().min(1, "Test method is required"),
  testSpec: z.string().min(1, "Test spec is required"),
  acceptanceSpec: z.string().min(1, "Acceptance spec is required"),
  toTable: z.string().min(1, "To table is required"),
  testProcedure: z.string().min(1, "Test procedure is required"),
  tech: z.string().min(1, "Tech is required"),
});

const jobRequestSchema = z.object({
  startDate: z.date({ required_error: "Date is required" }),
  lastDate: z.date({ required_error: "Date-Time-Day is required" }),
  purchaseOrder: z.string().optional(),
  summary: z.string().min(5, "Summary must be at least 5 characters"),
  detailsProvided: z.string().min(5, "Details provided required"),
  comment: z.string().optional(),
  timeRequired: z.string().min(1, "Time required"),
  status: z.string().min(1, "Status required"),
  ohsRequirements: z.object({
    swms: z.boolean().default(false),
    jsa: z.boolean().default(false),
    safetyBoots: z.boolean().default(false),
  }),
  safetyReference: z.string().optional(),
  ppeRequired: z.object({
    hardhat: z.boolean().default(false),
    bumpGap: z.boolean().default(false),
    highVis: z.boolean().default(false),
    longSleeve: z.boolean().default(false),
    safetyGlasses: z.boolean().default(false),
    safetyBoots: z.boolean().default(false),
    faceShield: z.boolean().default(false),
    weldGlass: z.boolean().default(false),
    hearingProtection: z.boolean().default(false),
    electricalProtection: z.boolean().default(false),
    respiratoryProtection: z.boolean().default(false),
  }),
  equipmentList: z.array(dynamicStringSchema),
  siteInduction: z.string().optional(),
  hseProcedures: z.array(dynamicStringSchema),
  testRows: z.array(testRowSchema).min(1, "At least one test row is required"),
});

export type JobRequestFormData = z.infer<typeof jobRequestSchema>;

interface JobRequestFormProps {
  onSubmit: (data: JobRequestFormData | JobRequest) => void;
  selectedClient?: ClientType;
  initialData?:
    | (JobRequestFormData & { jobId: string; files?: JobRequestFileList[] })
    | JobRequest;
  isEditing?: boolean;
}

export function JobRequestForm({
  onSubmit,
  selectedClient,
  initialData,
  isEditing = false,
}: JobRequestFormProps) {
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [openFileUpload, setOpenFileUpload] = useState<boolean>(false);
  const [uploadedFiles, setUploadedFiles] = useState<Array<File>>([]);
  const [oldFiles, setOldFiles] = useState<Array<JobRequestFileList>>(
    initialData && 'files' in initialData && Array.isArray(initialData.files) ? initialData.files : []
  );
  const [isDragging, setIsDragging] = useState(false);
  const [deletedFiles, setDeletedFiles] = useState<string[]>([]);
  
  const form = useForm<JobRequestFormData>({
    resolver: zodResolver(jobRequestSchema),
    defaultValues: initialData
      ? (() => {
        const initialOhs: Record<string, boolean> = { swms: false, jsa: false, safetyBoots: false };
        if (Array.isArray((initialData as any).ohs_requirements)) {
          (initialData as any).ohs_requirements.forEach((req: any) => {
            const key = req.type.toLowerCase() === "swms" ? "swms" : req.type.toLowerCase() === "jsa" ? "jsa" : "safetyBoots";
            initialOhs[key] = req.is_checked;
          });
        }

        const initialPpe: Record<string, boolean> = {
          hardhat: false, bumpGap: false, highVis: false, longSleeve: false, safetyGlasses: false, safetyBoots: false,
          faceShield: false, weldGlass: false, hearingProtection: false, electricalProtection: false, respiratoryProtection: false,
        };
        if (Array.isArray((initialData as any).ppe_requirements)) {
          (initialData as any).ppe_requirements.forEach((req: any) => {
             const keyMatches = Object.keys(initialPpe).find(k => k.toLowerCase() === (req.type || "").toLowerCase().replace(/ /g, ''));
             if (keyMatches) initialPpe[keyMatches] = req.is_checked;
             else initialPpe[req.type] = req.is_checked;
          });
        }

        const initialTestRows = Array.isArray((initialData as any).test_methods) 
          ? (initialData as any).test_methods.map((method: any) => ({
              testMethod: method.worksheet_form_id || "",
              testSpec: method.spec || "",
              acceptanceSpec: method.acceptance || "",
              toTable: method.to_table || "",
              testProcedure: method.procedure || "",
              tech: method.assigned_user_id ? method.assigned_user_id.toString() : "",
            }))
          : initializationData.testRows;
          
        return {
          ...initialData,
          startDate: moment((initialData as any).startDate || (initialData as any).from_date).toDate(),
          lastDate: moment((initialData as any).lastDate || (initialData as any).to_date).toDate(),
          timeRequired: (initialData as any).time_required || (initialData as any).timeRequired || "",
          purchaseOrder: (initialData as any).purchase_order || (initialData as any).purchaseOrder || "",
          detailsProvided: (initialData as any).details_provided || (initialData as any).detailsProvided || "",
          safetyReference: (initialData as any).safety_reference || (initialData as any).safetyReference || "",
          siteInduction: (initialData as any).induction_details || (initialData as any).siteInduction || "",
          status: (initialData as any).status ? (initialData as any).status.charAt(0).toUpperCase() + (initialData as any).status.slice(1).toLowerCase() : "Pending",
          ohsRequirements: initialOhs,
          ppeRequired: initialPpe,
          testRows: initialTestRows,
          equipmentList: Array.isArray((initialData as any).equipment) ? (initialData as any).equipment.map((eq: any) => ({ value: eq.name })) : [],
          hseProcedures: Array.isArray((initialData as any).hse_procedures) ? (initialData as any).hse_procedures.map((hse: any) => ({ value: hse.detail })) : [],
        };
      })()
      : initializationData,
  });

  const {
    fields: equipmentFields,
    append: appendEquipment,
    remove: removeEquipment,
  } = useFieldArray({
    control: form.control,
    name: "equipmentList",
  });

  const {
    fields: hseFields,
    append: appendHse,
    remove: removeHse,
  } = useFieldArray({
    control: form.control,
    name: "hseProcedures",
  });

  const {
    fields: testRows,
    append: appendTestRow,
    remove: removeTestRow,
  } = useFieldArray({
    control: form.control,
    name: "testRows",
  });

  const { data: usersList } = useQuery({
    queryKey: ["usersList"],
    queryFn: () => getUsers({ skip: 0, take: 100, }),
    refetchOnWindowFocus: false,
  });

  const { data: activeWorksheets } = useQuery({
    queryKey: ["worksheetforJobrequestform", selectedClient],
    queryFn: getWorkSheets,
    refetchOnWindowFocus: false,
  });

  const { mutate: save, isPending: saveLoading } = useMutation({
    mutationFn: saveJobRequest,
    onSuccess: (result) => {
      onSubmit(result.data);
      form.reset();
      toast({
        title: "Success",
        description: "Job request created.",
        className: "bg-green-500 text-white",
      });
    },
    onError: (e: any) => {
      toast({
        title: "Error",
        description: e.message,
        className: "bg-red-500 text-white",
      });
    },
  });

  const { mutate: update, isPending: updateLoading } = useMutation({
    mutationFn: updateJobRequest,
    onSuccess: (result) => {
      onSubmit(result.data);
      form.reset();
      toast({
        title: "Job request updated successfully",
        description: `Job request has been updated successfully.`,
        className: "bg-green-500 text-white",
      });
    },
    onError: (e: any) => {
      toast({
        title: "Error",
        description: e.message,
        className: "bg-red-500 text-white",
      });
    },
  });

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleSubmit = (data: JobRequestFormData) => {
    console.log(data)
    if (!selectedClient) return;
    const requestData = {
      client_id: selectedClient.id,
      from_date: moment(data.startDate).format("YYYY-MM-DD"),
      to_date: moment(data.lastDate).format("YYYY-MM-DD"),
      time_required: data.timeRequired,
      status: data.status,
      purchase_order: data.purchaseOrder || "",
      summary: data.summary,
      details_provided: data.detailsProvided,
      safety_reference: data.safetyReference || "",
      induction_details: data.siteInduction || "",
      ohs_requirements: Object.entries(data.ohsRequirements).map(([k, v]) => ({
        type: k.toUpperCase(),
        is_checked: Boolean(v)
      })),
      ppe_requirements: Object.entries(data.ppeRequired).map(([k, v]) => ({
        type: k,
        is_checked: Boolean(v)
      })),
      test_methods: data.testRows.map((row, index) => ({
        worksheet_form_id: row.testMethod,
        assigned_user_id: parseInt(row.tech) || 0,
        spec: row.testSpec,
        acceptance: row.acceptanceSpec,
        to_table: row.toTable,
        procedure: row.testProcedure,
        order_index: index
      })),
      equipment: data.equipmentList?.map((eq, index) => ({
        name: eq.value,
        order_index: index
      })) || [],
      hse_procedures: data.hseProcedures?.map((hse, index) => ({
        detail: hse.value,
        order_index: index
      })) || []
    };
      if (!isEditing) {
      save(requestData);
    } else {
      update({ ...requestData, id: (initialData as any).id });
    }
    // File uploads are stripped temporarily until a separate endpoint is connected
    // As the backend does not accept multipart/form-data for the nested job struct
  };

  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

  const processFiles = (files: File[]) => {
    const validFiles: File[] = [];
    const rejectedFiles: string[] = [];

    files.forEach((file) => {
      if (file.size <= MAX_FILE_SIZE) {
        validFiles.push(file);
      } else {
        rejectedFiles.push(file.name);
      }
    });

    if (rejectedFiles.length) {
      toast({
        title: "File size exceeded",
        description: `These files exceed 5MB: ${rejectedFiles.join(", ")}`,
        variant: "destructive",
      });
    }

    setUploadedFiles((prev) => {
      if (prev.length + validFiles.length > 50) {
        toast({
          title: "Limit Reached",
          description: "You can upload a maximum of 50 files.",
          variant: "destructive",
        });
        return prev;
      }
      return [...prev, ...validFiles];
    });
  };

  const removeFile = (index: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const removeFilePath = (path: string) => {
    const updatedList = oldFiles.filter((f) => f.url != path);
    setOldFiles(updatedList);
    setDeletedFiles((prev) => [...prev, path]);
  };

  const handleViewFile = (file: File | JobRequestFileList) => {
    if ((file as JobRequestFileList)?.fileName) {
      window.open(`${baseURL}${(file as JobRequestFileList)?.url}`, "_blank", "noopener,noreferrer");
    } else {
      const fileURL = URL.createObjectURL(file as File);
      window.open(fileURL, "_blank");
      setTimeout(() => URL.revokeObjectURL(fileURL), 1000);
    }
  };

  const fileListData = useMemo(() => {
    return [...uploadedFiles, ...oldFiles];
  }, [oldFiles, uploadedFiles]);

  return (
    <div className="w-full max-w-6xl space-y-6">
      {selectedClient && (
        <Card>
          <CardHeader>
            <CardTitle className="text-primary text-lg">
              Selected Client Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="font-medium text-muted-foreground">
                  Business Name:
                </span>
                <p className="text-foreground">{selectedClient.business_name}</p>
              </div>
              <div>
                <span className="font-medium text-muted-foreground">
                  Email:
                </span>
                <p className="text-foreground">{selectedClient.email}</p>
              </div>
              <div>
                <span className="font-medium text-muted-foreground">
                  Phone:
                </span>
                <p className="text-foreground">{selectedClient.phone}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      <Card>
        <CardHeader>
          <CardTitle className="text-primary text-lg flex justify-between">
            {isEditing ? "Edit Job Request" : "Create Job Request"}
            <Button
              size="sm"
              className="relative"
              onClick={() => setOpenFileUpload(true)}
            >
              Upload files
              {Boolean(fileListData?.length) && (
                <Badge
                  variant="default"
                  className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs bg-blue-400 text-white"
                >
                  {fileListData?.length}
                </Badge>
              )}
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form methods={form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-8"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="startDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>From</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              className={cn(
                                "pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value
                                ? format(field.value, "PPP")
                                : "Pick a date"}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="lastDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>To</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              className={cn(
                                "pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value
                                ? format(field.value, "PPP")
                                : "Pick a date"}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="timeRequired"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Time Required</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. 4 hours" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {jobStatus.map((s) => (
                            <SelectItem key={s} value={s}>
                              {s}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="purchaseOrder"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Purchase Order</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="summary"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Summary</FormLabel>
                      <FormControl>
                        <Textarea {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="detailsProvided"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Details Provided</FormLabel>
                      <FormControl>
                        <Textarea {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="safetyReference"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Safety Reference</FormLabel>
                      <FormControl>
                        <Textarea {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="siteInduction"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Induction Details</FormLabel>
                      <FormControl>
                        <Textarea {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              <div className="space-y-4 pt-4 pb-2 border-y">
                <h3 className="text-lg font-bold">Requirements & Equipment</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-2">OHS Requirements</h4>
                    <div className="flex flex-col gap-2">
                      {['swms', 'jsa', 'safetyBoots'].map((key) => (
                        <FormField
                          key={key}
                          control={form.control}
                          name={`ohsRequirements.${key as keyof JobRequestFormData['ohsRequirements']}`}
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-center gap-2 space-y-0">
                              <FormControl>
                                <Checkbox checked={field.value as boolean} onCheckedChange={field.onChange} />
                              </FormControl>
                              <FormLabel className="uppercase">{key}</FormLabel>
                            </FormItem>
                          )}
                        />
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">PPE Required</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {Object.keys(initializationData.ppeRequired).map((key) => (
                        <FormField
                          key={key}
                          control={form.control}
                          name={`ppeRequired.${key as keyof (typeof initializationData)['ppeRequired']}`}
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-center gap-2 space-y-0">
                              <FormControl>
                                <Checkbox checked={field.value as boolean} onCheckedChange={field.onChange} />
                              </FormControl>
                              <FormLabel className="capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</FormLabel>
                            </FormItem>
                          )}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold">Equipment List</h4>
                      <Button type="button" variant="outline" size="sm" onClick={() => appendEquipment({ value: "" })}>
                        <Plus className="h-4 w-4" /> Add
                      </Button>
                    </div>
                    <div className="space-y-2">
                      {equipmentFields.map((field, index) => (
                        <div key={field.id} className="flex gap-2">
                          <FormField
                            control={form.control}
                            name={`equipmentList.${index}.value`}
                            render={({ field }) => (
                              <FormControl>
                                <Input {...field} placeholder="Equipment name" />
                              </FormControl>
                            )}
                          />
                          <Button type="button" variant="ghost" size="sm" onClick={() => removeEquipment(index)}>
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold">HSE Procedures</h4>
                      <Button type="button" variant="outline" size="sm" onClick={() => appendHse({ value: "" })}>
                        <Plus className="h-4 w-4" /> Add
                      </Button>
                    </div>
                    <div className="space-y-2">
                      {hseFields.map((field, index) => (
                        <div key={field.id} className="flex gap-2">
                          <FormField
                            control={form.control}
                            name={`hseProcedures.${index}.value`}
                            render={({ field }) => (
                              <FormControl>
                                <Input {...field} placeholder="Procedure detail" />
                              </FormControl>
                            )}
                          />
                          <Button type="button" variant="ghost" size="sm" onClick={() => removeHse(index)}>
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold">Test Methods</h3>
                  <Button
                    type="button"
                    onClick={() =>
                      appendTestRow({
                        testMethod: "",
                        testSpec: "",
                        acceptanceSpec: "",
                        toTable: "",
                        testProcedure: "",
                        tech: "",
                      })
                    }
                    variant="outline"
                    size="sm"
                  >
                    <Plus className="h-4 w-4 mr-2" /> Add Row
                  </Button>
                </div>
                <div className="overflow-x-auto rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Method</TableHead>
                        <TableHead>Spec</TableHead>
                        <TableHead>Acceptance</TableHead>
                        <TableHead>To Table</TableHead>
                        <TableHead>Procedure</TableHead>
                        <TableHead>Tech</TableHead>
                        <TableHead className="w-[50px]">Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {testRows.map((field, index) => (
                        <TableRow key={field.id}>
                          <TableCell>
                            <FormField
                              control={form.control}
                              name={`testRows.${index}.testMethod`}
                              render={({ field }) => (
                                <Select
                                  onValueChange={field.onChange}
                                  value={field.value}
                                >
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Method" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {activeWorksheets?.data?.map((ws) => (
                                      <SelectItem
                                        key={ws.worksheet_id}
                                        value={ws.worksheet_id}
                                      >
                                        {ws.name}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              )}
                            />
                          </TableCell>
                          <TableCell>
                            <FormField
                              control={form.control}
                              name={`testRows.${index}.testSpec`}
                              render={({ field }) => <Input {...field} />}
                            />
                          </TableCell>
                          <TableCell>
                            <FormField
                              control={form.control}
                              name={`testRows.${index}.acceptanceSpec`}
                              render={({ field }) => <Input {...field} />}
                            />
                          </TableCell>
                          <TableCell>
                            <FormField
                              control={form.control}
                              name={`testRows.${index}.toTable`}
                              render={({ field }) => <Input {...field} />}
                            />
                          </TableCell>
                          <TableCell>
                            <FormField
                              control={form.control}
                              name={`testRows.${index}.testProcedure`}
                              render={({ field }) => <Input {...field} />}
                            />
                          </TableCell>
                          <TableCell>
                            <FormField
                              control={form.control}
                              name={`testRows.${index}.tech`}
                              render={({ field }) => (
                                <Select
                                  onValueChange={field.onChange}
                                  value={field.value}
                                >
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Tech" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                      {usersList?.data?.list?.map((t: any) => (
                                        <SelectItem key={t.id} value={t.id.toString()}>
                                          {t.first_name} {t.last_name}
                                        </SelectItem>
                                      ))}
                                  </SelectContent>
                                </Select>
                              )}
                            />
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-1">
                               <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => removeTestRow(index)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
              
              <div className="flex justify-end pt-4">
                 <Button type="submit" loading={saveLoading || updateLoading}>
                    {isEditing ? "Update Job" : "Create Job"}
                 </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      <Dialog open={openFileUpload} onOpenChange={setOpenFileUpload}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>Job Upload Files</DialogTitle>
          </DialogHeader>
          <div
            className={cn(
              "border-2 border-dashed rounded-lg p-8 text-center",
              isDragging ? "border-primary bg-primary/10" : "border-muted"
            )}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <div className="flex flex-col items-center gap-2">
              <Upload className="h-8 w-8 text-muted-foreground" />
              <p>Drag and drop files here, or click to browse</p>
              <Input
                type="file"
                multiple
                className="hidden"
                id="file-upload"
                onChange={(e) => e.target.files && processFiles(Array.from(e.target.files))}
              />
              <Button onClick={() => document.getElementById("file-upload")?.click()}>
                Browse Files
              </Button>
            </div>
          </div>
          {fileListData.length > 0 && (
            <div className="space-y-4 max-h-[300px] overflow-y-auto mt-4 pr-2">
              {fileListData.map((file, index) => (
                <div key={index} className="flex items-center justify-between p-2 border rounded">
                  <div className="flex items-center gap-2 overflow-hidden">
                    <span className="text-sm truncate font-medium">
                      {(file as any).fileName || (file as File).name}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleViewFile(file)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        if ((file as any).url) {
                          removeFilePath((file as any).url);
                        } else {
                          removeFile(index - oldFiles.length);
                        }
                      }}
                      className="text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
