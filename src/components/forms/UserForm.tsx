import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Camera } from "lucide-react";
import { UserType } from "@/types/auth";
import { useMutation } from "@tanstack/react-query";
import { userRegistration, userUpdation } from "@/services/user.services";
import { useAuth } from "@/hooks/useAuth";
import { setItem, storageKeys } from "@/utils/storage";

const userSchema = z.object({
  userName: z.string().min(2, "User name must be at least 2 characters"),
  userRole: z.string().min(1, "User role is required"),
  designation: z.string().min(1, "Designation is required"),
  department: z.string().min(1, "Department is required"),
  email: z.string().email("Invalid email address"),
  // file: z
  //   .any()
  //   .refine((files) => files?.length > 0, "Avatar file is required")
  //   .refine(
  //     (files) => files?.[0]?.size <= 2 * 1024 * 1024, // <= 2 MB
  //     "File size must be less than 2MB"
  //   )
  //   .refine(
  //     (files) => ["image/jpeg", "image/png"].includes(files?.[0]?.type),
  //     "Only JPEG and PNG images are allowed"
  //   )
  //   .optional(),
});

type UserFormData = z.infer<typeof userSchema>;

interface UserFormProps {
  onSubmit: (data: UserType) => void;
  isEditing?: boolean;
}

const userRoles = ["Admin", "Manager", "Employee", "Contractor", "Intern"];
const designations = [
  "Software Engineer",
  "Project Manager",
  "Designer",
  "Analyst",
  "Developer",
];
const departments = ["IT", "HR", "Finance", "Marketing", "Operations", "Sales"];

export function UserForm({ onSubmit, isEditing = false }: UserFormProps) {
  const { toast } = useToast();
  const { user,setUser } = useAuth();
  const [avatarPreview, setAvatarPreview] = useState<string>(
    `${import.meta.env.VITE_API_URL}${user?.imageUrl || ""}`
  );
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const form = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: user || {
      userName: "",
      userRole: "",
      designation: "",
      department: "",
      email: "",
    },
  });

  const { mutate: createUser } = useMutation({
    mutationFn: userRegistration,
  });
  const { mutate: updateUser } = useMutation({
    mutationFn: userUpdation,
    onSuccess: (result) => {
      setItem(storageKeys.user,result.data)
      setUser(result.data)
      toast({
        title: "",
        description: result.message,
        className: "bg-green-500 text-white",
      });
    },
    onError:(error)=>{
    toast({
        title: "",
        description: error.message,
        className: "bg-red-500 text-white",
      });
    }
  });

  const handleSubmit = (data: UserFormData) => {
    console.log("form data", data);
    onSubmit(data as UserType);
    const formData = new FormData();
    formData.append("id",user.id)
    formData.append("file", file);
    for (let key in data) {
      formData.append(key, data[key]);
    }
    if (!isEditing) {
      form.reset();
    } else {
      file && formData.append("oldImageUrl",user.imageUrl)
      updateUser(formData);
    }
  };

  const handleReset = () => {
    form.reset(
      user || {
        userName: "",
        userRole: "",
        designation: "",
        department: "",
        email: "",
      }
    );
    toast({
      title: "Form reset",
      description: "All fields have been cleared.",
    });
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    setFile(selectedFile);
    if (selectedFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setAvatarPreview(result);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="text-primary">
          {isEditing ? "Edit User" : "Create New User"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form methods={form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <div className="flex flex-col items-center gap-4 pb-4">
              <div className="relative">
                <Avatar
                  className="h-24 w-24 cursor-pointer hover:opacity-80 transition-opacity border-2 border-primary"
                  onClick={handleAvatarClick}
                >
                  <AvatarImage src={avatarPreview} alt="User avatar" />
                  <AvatarFallback className="bg-primary/10 text-primary text-2xl">
                    {user?.shortName ||
                      form.watch("userName")?.charAt(0)?.toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <Button
                  type="button"
                  size="icon"
                  variant="secondary"
                  className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full shadow-lg"
                  onClick={handleAvatarClick}
                >
                  <Camera className="h-4 w-4" />
                </Button>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={(e) => {
                  handleFileChange(e);
                }}
                className="hidden"
              />
              <p className="text-xs text-muted-foreground">
                Click avatar to upload image
              </p>
            </div>
            <FormField
              control={form.control}
              name="userName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>User Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter user name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="userRole"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>User Role</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select user role" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {userRoles.map((role) => (
                        <SelectItem key={role} value={role}>
                          {role}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="designation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Designation</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select designation" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {designations.map((designation) => (
                        <SelectItem key={designation} value={designation}>
                          {designation}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="department"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Department</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select department" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {departments.map((dept) => (
                        <SelectItem key={dept} value={dept}>
                          {dept}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

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

            <div className="flex gap-4 pt-4">
              <Button type="submit" className="flex-1">
                {isEditing ? "Update User" : "Submit"}
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
