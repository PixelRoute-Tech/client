import { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Camera } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const companySchema = z.object({
  name: z.string().min(1, "Company name is required"),
  email: z.string().email("Invalid email address"),
  contactNo: z.string().min(1, "Contact number is required"),
  address: z.string().min(1, "Address is required"),
  lisenceNo: z.string().min(1, "License number is required"),
  description: z.string().min(1, "Description is required"),
});

type CompanyFormData = z.infer<typeof companySchema>;

interface CompanyFormProps {
  onSubmit: (data: CompanyFormData & { logo?: string,_id?:string }) => void;
  initialData?: CompanyFormData & { logo?: string,_id?:string };
  isEditing?: boolean;
}

export default function CompanyForm({
  onSubmit,
  initialData,
  isEditing = false,
}: CompanyFormProps) {
  const [logoPreview, setLogoPreview] = useState<string | undefined>(
    initialData?.logo
  );
  const [logoFile, setLogoFile] = useState<string | undefined>(
    initialData?.logo
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<CompanyFormData>({
    resolver: zodResolver(companySchema),
    defaultValues: initialData || {
      name: "",
      email: "",
      contactNo: "",
      address: "",
      lisenceNo: "",
      description: "",
    },
  });

  useEffect(() => {
    if (initialData) {
      form.reset(initialData);
      setLogoPreview(initialData.logo);
      setLogoFile(initialData.logo);
    }
  }, [initialData, form]);

  const handleSubmit = (data: CompanyFormData) => {
    if(initialData?._id){
    onSubmit({ ...data, logo: logoFile ,_id:initialData._id,});
    }else{
      onSubmit({ ...data, logo: logoFile });
    }
  };

  const handleReset = () => {
    form.reset();
    setLogoPreview(undefined);
    setLogoFile(undefined);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleLogoClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "Error",
          description: "File size must be less than 5MB",
          variant: "destructive",
        });
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setLogoPreview(base64String);
        setLogoFile(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{isEditing ? "Edit Company" : "Add New Company"}</CardTitle>
        <CardDescription>
          {isEditing
            ? "Update company information"
            : "Fill in the details to add a new company"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div
                className="w-32 h-32 rounded-full border-2 border-dashed border-muted-foreground flex items-center justify-center cursor-pointer hover:border-primary transition-colors overflow-hidden bg-muted"
                onClick={handleLogoClick}
              >
                {logoPreview ? (
                  <img
                    src={logoPreview}
                    alt="Logo preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Camera className="w-8 h-8 text-muted-foreground" />
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Company Name *</Label>
              <Input id="name" {...form.register("name")} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input id="email" type="email" {...form.register("email")} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contactNo">Contact Number *</Label>
              <Input id="contactNo" {...form.register("contactNo")} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="lisenceNo">License Number *</Label>
              <Input id="lisenceNo" {...form.register("lisenceNo")} />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Address *</Label>
            <Textarea id="address" {...form.register("address")} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea id="description" {...form.register("description")} />
          </div>

          <div className="flex gap-4 pt-4">
            <Button type="submit" className="flex-1">
              {isEditing ? "Update Company" : "Add Company"}
            </Button>
            <Button type="button" variant="outline" onClick={handleReset}>
              Reset
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
