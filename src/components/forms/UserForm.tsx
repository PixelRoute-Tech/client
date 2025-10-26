import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Camera } from "lucide-react";

const userSchema = z.object({
  userName: z.string().min(2, "User name must be at least 2 characters"),
  userRole: z.string().min(1, "User role is required"),
  designation: z.string().min(1, "Designation is required"),
  department: z.string().min(1, "Department is required"),
  email: z.string().email("Invalid email address"),
});

type UserFormData = z.infer<typeof userSchema>;

interface UserFormProps {
  onSubmit: (data: UserFormData) => void;
  initialData?: UserFormData;
  isEditing?: boolean;
}

const userRoles = ["Admin", "Manager", "Employee", "Contractor", "Intern"];
const designations = ["Software Engineer", "Project Manager", "Designer", "Analyst", "Developer"];
const departments = ["IT", "HR", "Finance", "Marketing", "Operations", "Sales"];

export function UserForm({ onSubmit, initialData, isEditing = false }: UserFormProps) {
  const { toast } = useToast();
  const form = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: initialData || {
      userName: "",
      userRole: "",
      designation: "",
      department: "",
      email: "",
    },
  });

  const handleSubmit = (data: UserFormData) => {
    console.log("form data",data)
    // onSubmit(data);
    if (!isEditing) {
      form.reset();
    }
    toast({
      title: isEditing ? "User updated successfully" : "User created successfully",
      description: `${data.userName} has been ${isEditing ? 'updated' : 'added'} to the system.`,
    });
  };

  const handleReset = () => {
    form.reset();
    toast({
      title: "Form reset",
      description: "All fields have been cleared.",
    });
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };


  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setAvatarPreview(result);
        form.setValue("avatar", result);
      };
      reader.readAsDataURL(file);
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
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
             <div className="flex flex-col items-center gap-4 pb-4">
              <div className="relative">
                <Avatar 
                  className="h-24 w-24 cursor-pointer hover:opacity-80 transition-opacity border-2 border-primary"
                  onClick={handleAvatarClick}
                >
                  <AvatarImage src={avatarPreview} alt="User avatar" />
                  <AvatarFallback className="bg-primary/10 text-primary text-2xl">
                    {form.watch("userName")?.charAt(0)?.toUpperCase() || "U"}
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
                onChange={handleFileChange}
                className="hidden"
              />
              <p className="text-xs text-muted-foreground">Click avatar to upload image</p>
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
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                    <Input type="email" placeholder="Enter email address" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-4 pt-4">
              <Button type="submit" className="flex-1">
                {isEditing ? "Update User" : "Submit"}
              </Button>
              <Button type="button" variant="outline" onClick={handleReset} className="flex-1">
                Reset
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}