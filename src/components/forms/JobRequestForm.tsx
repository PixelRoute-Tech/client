import { useMemo, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format } from "date-fns";
import {
  CalendarIcon,
  Plus,
  Trash2,
  ClipboardPenLine,
  Upload,
  ShieldCheck,
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
  FormDescription,
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

export const jobStatus = ["Pending", "Approved", "Completed", "Rejected"];
const initializationData = {
  startDate: new Date(),
  lastDate: new Date(),
  summary: "",
  detailsProvided: "",
  comment: "",
  timeRequired: "",
  // requiredDocument: "",
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
// Helper for dynamic string arrays
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
  // requiredDocument: z.string().min(5, "Required documents required"),
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
    Boolean(initialData?.files) ? initialData?.files : []
  );
  const [deletedFiles, setDeletedFiles] = useState<string[]>([]);
  const form = useForm<JobRequestFormData>({
    resolver: zodResolver(jobRequestSchema),
    defaultValues: initialData
      ? {
          ...initialData,
          startDate: moment(initialData.startDate).toDate(),
          lastDate: moment(initialData.lastDate).toDate(),
        }
      : initializationData,
  });

  // Field Arrays for Dynamic Safety Inputs
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
    queryFn: getUsers,
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

  const handleSubmit = (data: JobRequestFormData) => {
    const formData = new FormData();
    formData.append("clientId", selectedClient.clientId);
    if (uploadedFiles.length > 0) {
      uploadedFiles.forEach((f) => {
        formData.append("files", f);
      });
    }
    if (deletedFiles?.length) {
      formData.append("deletedFiles", JSON.stringify(deletedFiles));
    }
    if (oldFiles?.length) {
      formData.append("previousFiles", JSON.stringify(oldFiles));
    }
    if (!isEditing) {
      formData.append(
        "data",
        JSON.stringify({
          ...data,
          createdBy: user?.id,
          testRows: data.testRows as TechRow[],
          comment: data.comment,
          clientId: selectedClient.clientId,
          clientName: selectedClient.businessName,
          clientAddress: selectedClient.businessAddress,
          clientEmail: selectedClient.email,
          startDate: moment(data.startDate).toDate(),
          lastDate: moment(data.lastDate).toDate(),
        })
      );
      save(formData);
    } else {
      formData.append(
        "data",
        JSON.stringify({
          ...initialData,
          ...data,
          testRows: data.testRows as TechRow[],
          createdBy: user.id,
          clientId: selectedClient.clientId,
          clientAddress: selectedClient.businessAddress,
          clientName: selectedClient.businessName,
          clientEmail: selectedClient.email,
        })
      );
      update(formData);
    }
  };

  const handleError = (error) => {
    console.log(error);
  };

  const handleOpenFileUpload = () => {
    setOpenFileUpload(true);
  };

  const handleCloseFileUpload = () => {
    setOpenFileUpload(false);
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(2)} KB`;
    }
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const validFiles: File[] = [];
    const rejectedFiles: string[] = [];

    Array.from(e.target.files).forEach((file) => {
      if (file.size <= MAX_FILE_SIZE) {
        validFiles.push(file);
      } else {
        rejectedFiles.push(file.name);
      }
    });

    if (rejectedFiles.length) {
      toast({
        title: "File size exceeded",
        description: `These files exceed 5MB:\n${rejectedFiles.join(", ")}`,
        variant: "destructive",
      });
    }

    if (uploadedFiles.length < 50) {
      setUploadedFiles((prev) => [...prev, ...validFiles]);
    } else {
      toast({
        title: "Maximum File Limit Reached",
        description: "You can upload a maximum of 50 files.",
        variant: "destructive",
      });
    }

    // Reset input so same file can be reselected
    e.target.value = "";
  };

  const removeFile = (index: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const removeFilePath = (path: string) => {
    const updatedList = oldFiles.filter((f) => f.url != path);
    setOldFiles(updatedList);
    setDeletedFiles((prev) => [...prev, path]);
  };

  const fileListData = useMemo(() => {
    return [...uploadedFiles, ...oldFiles];
  }, [oldFiles, uploadedFiles]);

  const technicianList = useMemo(() => {
    return usersList?.data.filter(
      (u: any) =>
        u.userRole.toLowerCase().includes("technician") ||
        u.designation.toLowerCase().includes("technician")
    );
  }, [usersList?.data]);

  return (
    <div className="w-full max-w-6xl space-y-6">
      {/* Client Details Section (Same as before) */}
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
                <p className="text-foreground">{selectedClient.businessName}</p>
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
              onClick={handleOpenFileUpload}
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
              onSubmit={form.handleSubmit(handleSubmit, handleError)}
              className="space-y-8"
            >
              {/* BASIC DETAILS GRID */}
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

              {/* REMAINING TEXT AREAS */}
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
              </div>

              {/* TEST METHODS TABLE (Same as before) */}
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
                                        key={ws.workSheetId}
                                        value={ws.workSheetId}
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
                                    {technicianList?.map((t) => (
                                      <SelectItem key={t.id} value={t.id}>
                                        {t.userName}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              )}
                            />
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-1">
                              {Boolean(initialData) && (
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    console.log(field);
                                    navigate(
                                      `${routes.worksheetDetails}?sheetid=${field.testMethod}&jobid=${initialData?.jobId}&clientId=${selectedClient.clientId}`
                                    );
                                  }}
                                >
                                  <ClipboardPenLine className="h-4 w-4" />
                                </Button>
                              )}
                              {testRows.length > 1 && (
                                <>
                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => removeTestRow(index)}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>

              {/* SAFETY SECTION */}
              <div className="space-y-6 border py-8 bg-slate-50/50 rounded px-6">
                <div className="flex items-center gap-2 mb-4">
                  <ShieldCheck className="h-5 w-5 text-blue-600" />
                  <h3 className="text-xl font-bold text-blue-900 uppercase tracking-tight">
                    Safety & HSE Requirements
                  </h3>
                </div>

                {/* 1. OHS Requirements */}
                <div className="space-y-3">
                  <FormLabel className="text-base font-semibold">
                    1. OHS Requirements
                  </FormLabel>
                  <div className="flex flex-wrap gap-6">
                    {["swms", "jsa", "safetyBoots"].map((item) => (
                      <FormField
                        key={item}
                        control={form.control}
                        name={`ohsRequirements.${item}` as any}
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <FormLabel className="font-normal uppercase">
                              {item}
                            </FormLabel>
                          </FormItem>
                        )}
                      />
                    ))}
                  </div>
                </div>

                {/* 2. Reference */}
                <FormField
                  control={form.control}
                  name="safetyReference"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base font-semibold">
                        2. Reference
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter safety references..."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* 3. PPE Required */}
                <div className="space-y-4">
                  <FormLabel className="text-base font-semibold">
                    3. PPE Required
                  </FormLabel>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {Object.keys(
                      form.getValues()?.ppeRequired ||
                        initializationData.ppeRequired
                    ).map((key) => (
                      <FormField
                        key={key}
                        control={form.control}
                        name={`ppeRequired.${key}` as any}
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <FormLabel className="font-normal capitalize">
                              {key.replace(/([A-Z])/g, " $1")}
                            </FormLabel>
                          </FormItem>
                        )}
                      />
                    ))}
                  </div>
                </div>

                {/* 4. Equipment */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <FormLabel className="text-base font-semibold">
                      4. Equipment
                    </FormLabel>
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      onClick={() => appendEquipment({ value: "" })}
                    >
                      <Plus className="h-3 w-3 mr-1" /> Add Equipment
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {equipmentFields.map((field, index) => (
                      <div key={field.id} className="flex gap-2">
                        <FormField
                          control={form.control}
                          name={`equipmentList.${index}.value`}
                          render={({ field }) => (
                            <FormControl>
                              <Input placeholder="Equipment name" {...field} />
                            </FormControl>
                          )}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeEquipment(index)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 5. Site Induction */}
                <FormField
                  control={form.control}
                  name="siteInduction"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base font-semibold">
                        5. Site/Remote Induction Required
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Details about induction..."
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                {/* 6. HSE Procedures */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <FormLabel className="text-base font-semibold">
                      6. Specific Relevant HSE Procedures
                    </FormLabel>
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      onClick={() => appendHse({ value: "" })}
                    >
                      <Plus className="h-3 w-3 mr-1" /> Add Procedure
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {hseFields.map((field, index) => (
                      <div key={field.id} className="flex gap-2">
                        <FormField
                          control={form.control}
                          name={`hseProcedures.${index}.value`}
                          render={({ field }) => (
                            <FormControl>
                              <Input
                                placeholder="Procedure detail"
                                {...field}
                              />
                            </FormControl>
                          )}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeHse(index)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex gap-4 pt-4 border-t">
                <Button
                  loading={saveLoading || updateLoading}
                  type="submit"
                  className="flex-1"
                >
                  {isEditing ? "Update Job Request" : "Submit Request"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => form.reset()}
                  className="flex-1"
                >
                  Reset
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
      <Dialog open={openFileUpload} onOpenChange={setOpenFileUpload}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Upload Images / Files</DialogTitle>
          </DialogHeader>
          <div className="space-y-1">
            {/* Upload Input */}
            <div className="w-full max-w-xl mx-auto">
              <div
                className={cn(
                  "relative group cursor-pointer",
                  "flex flex-col items-center justify-center p-10",
                  "border-2 border-dashed border-muted-foreground/25 rounded-xl",
                  "bg-muted/5 hover:bg-muted/10 transition-colors",
                  "focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2"
                )}
              >
                {/* Hidden Input - Stretched to cover the whole area */}
                <Input
                  type="file"
                  multiple
                  onChange={handleFileChange}
                  className="absolute inset-0 opacity-0 cursor-pointer z-10"
                />

                {/* Visual Content */}
                <div className="flex flex-col items-center text-center gap-3">
                  <div className="p-4 rounded-full bg-background shadow-sm border group-hover:scale-110 transition-transform">
                    <Upload className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-base font-medium">
                      Click to upload or drag and drop
                    </p>
                    <p className="text-sm text-muted-foreground">
                      PDF, PNG, JPG or DOC (Max 5MB per file)
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="text-muted-foreground text-[.6rem] mb-36">
              Maximum file size 5 MB
            </div>
            {/* File List */}
            {Boolean(uploadedFiles.length) ||
            Boolean(initialData?.files?.length) ? (
              <div className="border rounded-md">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>File Name</TableHead>
                      <TableHead>Size</TableHead>
                      <TableHead className="w-[80px] text-center">
                        Action
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {fileListData.map(
                      (file: File | JobRequestFileList, index) => (
                        <TableRow key={index}>
                          <TableCell className="truncate max-w-[400px]">
                            {Boolean((file as File)?.name) && (
                              <span className="bg-green-600 me-2 rounded-full px-2 py-1 text-white">
                                New
                              </span>
                            )}
                            {(file as File)?.name ||
                              (file as JobRequestFileList)?.fileName}
                          </TableCell>
                          <TableCell>
                            {Boolean(file?.size)
                              ? formatFileSize(Number(file?.size))
                              : "-"}
                          </TableCell>
                          <TableCell className="text-center">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => {
                                (file as JobRequestFileList)?.fileName
                                  ? removeFilePath(
                                      (file as JobRequestFileList)?.url
                                    )
                                  : removeFile(index);
                              }}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      )
                    )}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <p className="text-sm text-center text-muted-foreground">
                No files uploaded yet.
              </p>
            )}
            <div className="flex justify-end items-center pt-2">
              <Button size="sm" onClick={handleCloseFileUpload}>
                Done
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
