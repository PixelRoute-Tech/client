import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format } from "date-fns";
import { CalendarIcon, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const testRowSchema = z.object({
  testMethod: z.string().min(1, "Test method is required"),
  testSpec: z.string().min(1, "Test spec is required"),
  acceptanceSpec: z.string().min(1, "Acceptance spec is required"),
  toTable: z.string().min(1, "To table is required"),
  testProcedure: z.string().min(1, "Test procedure is required"),
  tech: z.string().min(1, "Tech is required"),
});

const jobRequestSchema = z.object({
  clientId: z.string().min(1, "Client selection is required"),
  date: z.date({
    required_error: "Date is required",
  }),
  summary: z.string().min(5, "Summary must be at least 5 characters"),
  detailsProvided: z.string().min(5, "Details provided must be at least 5 characters"),
  comment: z.string().optional(),
  dateTimeDay: z.date({
    required_error: "Date-Time-Day is required",
  }),
  divisionRules: z.string().min(1, "Division rules is required"),
  testRows: z.array(testRowSchema).min(1, "At least one test row is required"),
});

type JobRequestFormData = z.infer<typeof jobRequestSchema>;

interface JobRequestFormProps {
  onSubmit: (data: JobRequestFormData) => void;
  selectedClient?: { id: string; businessName: string; email: string; phone: string };
  initialData?: JobRequestFormData;
  isEditing?: boolean;
}

export function JobRequestForm({ onSubmit, selectedClient, initialData, isEditing = false }: JobRequestFormProps) {
  const { toast } = useToast();
  const form = useForm<JobRequestFormData>({
    resolver: zodResolver(jobRequestSchema),
    defaultValues: initialData || {
      clientId: selectedClient?.id || "",
      date: new Date(),
      summary: "",
      detailsProvided: "",
      comment: "",
      dateTimeDay: new Date(),
      divisionRules: "",
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
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "testRows",
  });

  const handleSubmit = (data: JobRequestFormData) => {
    onSubmit(data);
    if (!isEditing) {
      form.reset();
    }
    toast({
      title: isEditing ? "Job request updated successfully" : "Job request created successfully",
      description: `Job request has been ${isEditing ? 'updated' : 'submitted'} successfully.`,
    });
  };

  const handleReset = () => {
    form.reset();
    toast({
      title: "Form reset",
      description: "All fields have been cleared.",
    });
  };

  const addTestRow = () => {
    append({
      testMethod: "",
      testSpec: "",
      acceptanceSpec: "",
      toTable: "",
      testProcedure: "",
      tech: "",
    });
  };

  return (
    <div className="w-full max-w-6xl space-y-6">
      {/* Client Details Header */}
      {selectedClient && (
        <Card>
          <CardHeader>
            <CardTitle className="text-primary">Selected Client Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="font-medium text-muted-foreground">Business Name:</span>
                <p className="text-foreground">{selectedClient.businessName}</p>
              </div>
              <div>
                <span className="font-medium text-muted-foreground">Email:</span>
                <p className="text-foreground">{selectedClient.email}</p>
              </div>
              <div>
                <span className="font-medium text-muted-foreground">Phone:</span>
                <p className="text-foreground">{selectedClient.phone}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Job Request Form */}
      <Card>
        <CardHeader>
          <CardTitle className="text-primary">
            {isEditing ? "Edit Job Request" : "Create Job Request"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            initialFocus
                            className="pointer-events-auto"
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="dateTimeDay"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Date-Time-Day</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP p")
                              ) : (
                                <span>Pick date and time</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            initialFocus
                            className="pointer-events-auto"
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="summary"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Summary</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Enter job summary" {...field} />
                    </FormControl>
                    <FormMessage />
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
                      <Textarea placeholder="Enter details provided" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="comment"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Comment (Optional)</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Enter any comments" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="divisionRules"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Division Rules (conf)</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter division rules" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Dynamic Test Table */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-foreground">Test Methods</h3>
                  <Button type="button" onClick={addTestRow} variant="outline" size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Row
                  </Button>
                </div>

                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Test Method</TableHead>
                        <TableHead>Test Spec</TableHead>
                        <TableHead>Acceptance Spec</TableHead>
                        <TableHead>To Table</TableHead>
                        <TableHead>Test Procedure</TableHead>
                        <TableHead>Tech</TableHead>
                        <TableHead className="w-[50px]">Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {fields.map((field, index) => (
                        <TableRow key={field.id}>
                          <TableCell>
                            <FormField
                              control={form.control}
                              name={`testRows.${index}.testMethod`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormControl>
                                    <Input placeholder="Test method" {...field} />
                                  </FormControl>
                                </FormItem>
                              )}
                            />
                          </TableCell>
                          <TableCell>
                            <FormField
                              control={form.control}
                              name={`testRows.${index}.testSpec`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormControl>
                                    <Input placeholder="Test spec" {...field} />
                                  </FormControl>
                                </FormItem>
                              )}
                            />
                          </TableCell>
                          <TableCell>
                            <FormField
                              control={form.control}
                              name={`testRows.${index}.acceptanceSpec`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormControl>
                                    <Input placeholder="Acceptance spec" {...field} />
                                  </FormControl>
                                </FormItem>
                              )}
                            />
                          </TableCell>
                          <TableCell>
                            <FormField
                              control={form.control}
                              name={`testRows.${index}.toTable`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormControl>
                                    <Input placeholder="To table" {...field} />
                                  </FormControl>
                                </FormItem>
                              )}
                            />
                          </TableCell>
                          <TableCell>
                            <FormField
                              control={form.control}
                              name={`testRows.${index}.testProcedure`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormControl>
                                    <Input placeholder="Test procedure" {...field} />
                                  </FormControl>
                                </FormItem>
                              )}
                            />
                          </TableCell>
                          <TableCell>
                            <FormField
                              control={form.control}
                              name={`testRows.${index}.tech`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormControl>
                                    <Input placeholder="Tech" {...field} />
                                  </FormControl>
                                </FormItem>
                              )}
                            />
                          </TableCell>
                          <TableCell>
                            {fields.length > 1 && (
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => remove(index)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <Button type="submit" className="flex-1">
                  {isEditing ? "Update Job Request" : "Submit"}
                </Button>
                <Button type="button" variant="outline" onClick={handleReset} className="flex-1">
                  Reset
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}