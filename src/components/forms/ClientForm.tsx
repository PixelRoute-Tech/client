import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { saveClient, updateClient } from "@/services/client.services";
import { ClientType } from "@/types/client.type";

const clientSchema = z.object({
  businessName: z.string().min(2, "Business name is required"),
  abnAcn: z.string().min(1, "ABN/ACN is required"),
  businessAddress: z.string().min(5, "Business address is required"),
  postalAddress: z.string().min(5, "Postal address is required"),
  phone: z.string().min(10, "Valid phone number is required"),
  email: z.string().email("Invalid email address"),
  accountDeptContact: z.string().min(2, "Account dept contact is required"),
  accountPhone: z.string().min(10, "Account phone is required"),
  fax: z.string().optional(),
  accountEmail: z.string().email("Invalid account email address"),
  invoiceEmail: z.string().email("Invalid invoice email address"),
});

type ClientFormData = z.infer<typeof clientSchema>;

interface ClientFormProps {
  onSubmit: (data: ClientType) => void;
  initialData?: (ClientFormData & ClientType) | null;
  isEditing?: boolean;
}

export function ClientForm({
  onSubmit,
  initialData,
  isEditing = false,
}: ClientFormProps) {
  const { toast } = useToast();
  const form = useForm<ClientFormData>({
    resolver: zodResolver(clientSchema),
    defaultValues: initialData || {
      businessName: "",
      abnAcn: "",
      businessAddress: "",
      postalAddress: "",
      phone: "",
      email: "",
      accountDeptContact: "",
      accountPhone: "",
      fax: "",
      accountEmail: "",
      invoiceEmail: "",
    },
  });

  const { mutate: save, isPending: saveLoading } = useMutation({
    mutationFn: saveClient,
    onSuccess: (result) => {
      form.reset();
      onSubmit(result.data as ClientType);
      toast({
        title:"Client registered successfully",
        description: `${result?.data?.businessName} has been ${
          isEditing ? "updated" : "added"
        } to the system.`,
        className: "bg-green-500 text-white",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Opps! Something went wrong",
        className: "bg-red-500 text-white",
      });
    },
  });
  
  const { mutate: update, isPending: updateLoading } = useMutation({
    mutationFn: updateClient,
    onSuccess: (result) => {
      form.reset();
      onSubmit(result.data as ClientType);
      toast({
        title:"Client updated successfully",
        description: `${result?.data?.businessName} has been ${
          isEditing ? "updated" : "added"
        } to the system.`,
        className: "bg-green-500 text-white",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Opps! Something went wrong",
        className: "bg-red-500 text-white",
      });
    },
  });

  const handleSubmit = (data: ClientFormData & ClientType) => {
    const formData = new FormData();
    for (let key in data) {
      formData.append(key, data[key]);
    }
    if (initialData) {
      formData.append("clientId",initialData.clientId)
      update(formData)
    } else {
      save(formData);
    }

    
  };

  const handleReset = () => {
    form.reset();
    toast({
      title: "Form reset",
      description: "All fields have been cleared.",
    });
  };

  return (
    <Card className="w-full max-w-4xl">
      <CardHeader>
        <CardTitle className="text-primary">
          {isEditing ? "Edit Client" : "Client Registration"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form methods={form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-6"
          >
            {/* Company Details Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground border-b border-border pb-2">
                Company Details
              </h3>

              <FormField
                control={form.control}
                name="businessName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Business Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter business name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="abnAcn"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>ABN/ACN</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter ABN/ACN" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone</FormLabel>
                      <FormControl>
                        <Input
                          type="tel"
                          placeholder="Enter phone number"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="businessAddress"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Business Address</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter business address"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="postalAddress"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Postal Address</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter postal address"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="Enter email address"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Account Details Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground border-b border-border pb-2">
                Account Details
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="accountDeptContact"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Account Dept Contact</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter contact person" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="accountPhone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone</FormLabel>
                      <FormControl>
                        <Input
                          type="tel"
                          placeholder="Enter account phone"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="fax"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Fax (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter fax number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="accountEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Account Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="Enter account email"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="invoiceEmail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email invoices to be issued to</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="Enter invoice email"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex gap-4 pt-4">
              <Button type="submit" className="flex-1">
                {isEditing ? "Update Client" : "Submit"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={handleReset}
                className="flex-1"
              >
                Reset
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
