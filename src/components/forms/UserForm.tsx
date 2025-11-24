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
import { useMutation, useQueries } from "@tanstack/react-query";
import { userRegistration, userUpdation } from "@/services/user.services";
import { useAuth } from "@/hooks/useAuth";
import { setItem, storageKeys } from "@/utils/storage";
import { useLocation } from "react-router-dom";
import {
  getDepartment,
  getDesignation,
  getUserRole,
} from "@/services/masters.services";
import { baseURL } from "@/config/network.config";

export function UserForm({ onSubmit }) {
  const location = useLocation();
  const user = location.state;
  const { user: currentUser } = useAuth();
  const userSchema = z.object({
    userName: z.string().min(2, "User name must be at least 2 characters"),
    userRole: z.string().min(1, "User role is required"),
    designation: z.string().min(1, "Designation is required"),
    department: z.string().min(1, "Department is required"),
    qualification: z.string().min(1, "Department is required"),
    email: z.string().email("Invalid email address"),
    password: user?.id
      ? z.string().optional().nullable()
      : z.string().min(5, "Minimum 5 characters required"),
  });

  type UserFormData = z.infer<typeof userSchema>;

  interface UserFormProps {
    onSubmit: (data: UserType) => void;
  }
  const { toast } = useToast();
  const { setUser } = useAuth();

  const [avatarPreview, setAvatarPreview] = useState<string>(
    `${baseURL}${user?.imageUrl || ""}`
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
      qualification: "",
      password: "",
    },
  });

  const [designations, departments, userRoles] = useQueries({
    queries: [
      {
        queryKey: ["createuserformdesignation"],
        queryFn: getDesignation,
        refetchOnWindowFocus: false,
      },
      {
        queryKey: ["createuserformdepartment"],
        queryFn: getDepartment,
        refetchOnWindowFocus: false,
      },
      {
        queryKey: ["createuserformuserroles"],
        queryFn: getUserRole,
        refetchOnWindowFocus: false,
      },
    ],
  });

  const { mutate: createUser, isLoading: saveLoading } = useMutation({
    mutationFn: userRegistration,
    onSuccess: (result) => {
      onSubmit(result.data);
      toast({
        title: "",
        description: result.message,
        className: "bg-green-500 text-white",
      });
      form.reset();
    },
    onError: (error: any) => {
      toast({
        title: "",
        description: error.message || "Opps! Something went wrong",
        className: "bg-red-500 text-white",
      });
    },
  });
  const { mutate: updateUser, isLoading: updateLoading } = useMutation({
    mutationFn: userUpdation,
    onSuccess: (result) => {
      if (currentUser.id == result.data.user.id) {
        setItem(storageKeys.user, {...result.data.user,company:result.data.company});
        setUser({...result.data.user,company:result.data.company});
      }
      onSubmit(result.data);
      toast({
        title: "",
        description: result.message,
        className: "bg-green-500 text-white",
      });
    },
    onError: (error: any) => {
      toast({
        title: "",
        description: error.message || "Opps! Something went wrong",
        className: "bg-red-500 text-white",
      });
    },
  });

  const handleSubmit = (data: UserFormData) => {
    const formData = new FormData();
    user?.id && formData.append("id", user?.id);
    formData.append("companyId", currentUser.company._id);
    formData.append("file", file);
    for (let key in data) {
      formData.append(key, data[key]);
    }
    if (!Boolean(user)) {
      createUser(formData);
    } else {
      file && formData.append("oldImageUrl", user?.imageUrl);
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
        password: "",
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
          {Boolean(user) ? "Edit User" : "Create New User"}
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
                      {userRoles?.data?.data?.map((role) => (
                        <SelectItem key={role._id} value={role.label}>
                          {role.label}
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
                      {designations?.data?.data?.map((designation) => (
                        <SelectItem
                          key={designation._id}
                          value={designation.label}
                        >
                          {designation.label}
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
                      {departments?.data?.data?.map((dept) => (
                        <SelectItem key={dept._id} value={dept.label}>
                          {dept.label}
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
              name="qualification"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Qualification/Certification</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter Qualification/Certification"
                      {...field}
                    />
                  </FormControl>
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
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem
                // className={Boolean(user) ? "hidden" : ""}
                >
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Password address"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-4 pt-4">
              <Button
                loading={saveLoading || updateLoading}
                type="submit"
                className="flex-1"
              >
                {Boolean(user) ? "Update User" : "Submit"}
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
