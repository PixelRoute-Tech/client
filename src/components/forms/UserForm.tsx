import { useEffect, useRef, useState } from "react";
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
import { useMutation, useQueries, useQuery } from "@tanstack/react-query";
import { getUserProfile, userRegistration, userUpdation } from "@/services/user.services";
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
    first_name: z.string().min(2, "First name must be at least 2 characters"),
    last_name: z.string().min(1, "Last name is required"),
    email: z.string().email("Invalid email address"),
    phone: z.string().min(10, "Phone number must be at least 10 characters"),
    address: z.string().optional().nullable(),
    password: user?.id
      ? z.string().optional().nullable()
      : z.string().min(5, "Minimum 5 characters required"),
    designation_id: z.string().min(1, "Designation is required"),
    department_id: z.string().min(1, "Department is required"),
    user_role_id: z.string().min(1, "User Role is required"),
    is_active: z.boolean().default(true),
  });

  type UserFormData = z.infer<typeof userSchema>;

  const { toast } = useToast();
  const { setUser } = useAuth();

  const form = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: {
          first_name: "",
          last_name: "",
          email: "",
          phone: "",
          address: "",
          designation_id: "",
          department_id: "",
          user_role_id: "",
          is_active: true,
          password: "",
        } ,
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

  const { data: profileData } = useQuery({
    queryKey: ["createuserformuserprofile"],
    queryFn: getUserProfile,
    refetchOnWindowFocus: false,
    enabled: user?.id == currentUser?.id,
  });

  // Effect to handle fetched profile data
  useEffect(() => {
    if (profileData?.data) {
      form.reset({
        ...profileData.data,
        designation_id: profileData.data.designation_id?.toString() || "",
        department_id: profileData.data.department_id?.toString() || "",
        user_role_id: profileData.data.user_role_id?.toString() || "",
        password: "",
        address: profileData.data.address || "",
      });
    }
  }, [profileData, form]);

  // Effect to handle user passed via state (e.g., when editing from a list)
  useEffect(() => {
    if (user?.id) {
      form.reset({
        ...user,
        designation_id: user.designation_id?.toString() || "",
        department_id: user.department_id?.toString() || "",
        user_role_id: user.user_role_id?.toString() || "",
        password: "",
        address: user.address || "",
      });
    }
  }, [user, form]);

  const { mutate: createUser, isLoading: saveLoading } = useMutation({
    mutationFn: userRegistration,
    onSuccess: (result) => {
      onSubmit(result.data);
      toast({
        title: "Success",
        description: result.message,
        className: "bg-green-500 text-white",
      });
      form.reset();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Something went wrong",
        className: "bg-red-500 text-white",
      });
    },
  });

  const { mutate: updateUser, isLoading: updateLoading } = useMutation({
    mutationFn: userUpdation,
    onSuccess: (result) => {
      if (currentUser.id === result.data.id) {
        setItem(storageKeys.user, {
          ...result.data,
          company: result.data.company,
        });
        setUser({ ...result.data });
      }
      onSubmit(result.data);
      toast({
        title: "Success",
        description: result.message,
        className: "bg-green-500 text-white",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Something went wrong",
        className: "bg-red-500 text-white",
      });
    },
  });

  const handleSubmit = (data: UserFormData) => {
    const { password, ...rest } = data;
    const payload: any = {
      ...rest,
      designation_id: parseInt(data.designation_id),
      department_id: parseInt(data.department_id),
      user_role_id: parseInt(data.user_role_id),
      avatar_url: null, // As per request to avoid avatar_url in the form/object
      company_id: currentUser.company_id,
      short_name: `${data.first_name.charAt(0)}${data.last_name.charAt(0)}`,
    };

    if (user?.id) {
      if (password && password.trim() !== "") {
        payload.password = password;
      }
      updateUser({ ...payload, id: user.id });
    } else {
      payload.password = password;
      createUser(payload);
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
    <Card className="w-full max-w-2xl glass-panel p-6 md:p-8">
      <CardHeader className="px-0 pt-0">
        <CardTitle className="text-2xl font-bold text-primary">
          {user?.id ? "Edit User Profile" : "User Information"}
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Please fill in the details below to {user?.id ? "update" : "create"} the user account.
        </p>
      </CardHeader>
      <CardContent className="px-0 pb-0">
        <Form methods={form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-6"
          >
            {/* Personal Details Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold border-b pb-2">Personal Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="first_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="last_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="john.doe@email.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Professional Details Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold border-b pb-2">Professional Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="user_role_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>User Role</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select role" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {userRoles?.data?.data?.map((role) => (
                            <SelectItem key={role.id} value={role.id.toString()}>
                              {role.name}
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
                  name="department_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Department</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select department" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {departments?.data?.data?.map((dept) => (
                            <SelectItem key={dept.id} value={dept.id.toString()}>
                              {dept.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="designation_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Designation</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select designation" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {designations?.data?.data?.map((designation) => (
                          <SelectItem
                            key={designation.id}
                            value={designation.id.toString()}
                          >
                            {designation.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Contact & Status Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold border-b pb-2">Contact & Security</h3>
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input placeholder="0412345678" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{user?.id ? "New Password (Optional)" : "Password"}</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="••••••••"
                          {...field}
                          value={field.value || ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter core address details" {...field} value={field.value || ""} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="is_active"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-[10px] border border-[var(--glass-border)] bg-[var(--glass-input-bg)] p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Active Account</FormLabel>
                      <p className="text-sm text-muted-foreground">
                        Allow this user to access the system.
                      </p>
                    </div>
                    <FormControl>
                      <input
                        type="checkbox"
                        checked={field.value}
                        onChange={field.onChange}
                        className="h-5 w-5 rounded border-[var(--glass-input-border)] bg-[var(--glass-input-bg)] text-primary focus:ring-primary/50"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <div className="flex gap-4 pt-6">
              <Button
                loading={saveLoading || updateLoading}
                type="submit"
                className="flex-1 h-11 text-lg"
              >
                {user?.id ? "Update User" : "Save User"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={handleReset}
                className="flex-1 h-11 text-lg"
              >
                Clear Form
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
