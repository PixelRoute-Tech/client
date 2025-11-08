import { deleteDepartment, deleteDesignation, deleteUserRole, saveDepartment, saveDesignation, saveUserRole } from "@/services/masters.services";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "./use-toast";
import { masterQueryKey } from "@/pages/MasterData";

export const useMasterDataSave = ({onSuccess}:{onSuccess:()=>void}) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  return {
    designationMutation: useMutation({
      mutationFn: saveDesignation,
      onSuccess: (result) => {
        queryClient.setQueryData([masterQueryKey.designation], (prev: any) => {
          return prev?.data?.length
            ? { ...prev, data: [result.data, ...prev.data] }
            : { data: [result.data] };
        });
       onSuccess && onSuccess()
        toast({
          title: "Success",
          description: result.message,
          className: "bg-green-500 text-white",
        });
      },
      onError: (e: any) => {
        toast({
          title: "Error",
          description: e.message || "Something went wrong !",
          variant: "destructive",
        });
      },
    }),
    departmentMutation:useMutation({
      mutationFn: saveDepartment,
      onSuccess: (result) => {
        queryClient.setQueryData([masterQueryKey.department], (prev: any) => {
          return prev?.data?.length
            ? { ...prev, data: [result.data, ...prev.data] }
            : { data: [result.data] };
        });
        onSuccess && onSuccess()
        toast({
          title: "Success",
          description: result.message,
          className: "bg-green-500 text-white",
        });
      },
      onError: (e: any) => {
        toast({
          title: "Error",
          description: e.message || "Something went wrong !",
          variant: "destructive",
        });
      },
    }),
    userRoleMutation:useMutation({
      mutationFn: saveUserRole,
      onSuccess: (result) => {
        queryClient.setQueryData([masterQueryKey.userRole], (prev: any) => {
          return prev?.data?.length
            ? { ...prev, data: [result.data, ...prev.data] }
            : { data: [result.data] };
        });
        onSuccess && onSuccess()
        toast({
          title: "Success",
          description: result.message,
          className: "bg-green-500 text-white",
        });
      },
      onError: (e: any) => {
        toast({
          title: "Error",
          description: e.message || "Something went wrong !",
          variant: "destructive",
        });
      },
    }),
  };
};

export const useMasterDataDelete = ({onSuccess}:{onSuccess?:()=>void}) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  return {
    designationDelete: useMutation({
      mutationFn: deleteDesignation,
      onSuccess: (result) => {
        queryClient.setQueryData([masterQueryKey.designation], (prev: any) => {
          return prev?.data?.length
            ? { ...prev, data: result.data }
            : { data: result.data };
        });
        onSuccess && onSuccess()
        toast({
          title: "Success",
          description: result.message,
          className: "bg-green-500 text-white",
        });
      },
      onError: (e: any) => {
        toast({
          title: "Error",
          description: e.message || "Something went wrong !",
          variant: "destructive",
        });
      },
    }),
    departmentDelete:useMutation({
      mutationFn: deleteDepartment,
      onSuccess: (result) => {
        queryClient.setQueryData([masterQueryKey.department], (prev: any) => {
          return prev?.data?.length
            ? { ...prev, data: result.data }
            : { data: result.data };
        });
        onSuccess && onSuccess()
        toast({
          title: "Success",
          description: result.message,
          className: "bg-green-500 text-white",
        });
      },
      onError: (e: any) => {
        toast({
          title: "Error",
          description: e.message || "Something went wrong !",
          variant: "destructive",
        });
      },
    }),
    userRoleDelete:useMutation({
      mutationFn: deleteUserRole,
      onSuccess: (result) => {
        queryClient.setQueryData([masterQueryKey.userRole], (prev: any) => {
          return prev?.data?.length
            ? { ...prev, data: result.data }
            : { data: result.data };
        });
        onSuccess && onSuccess()
        toast({
          title: "Success",
          description: result.message,
          className: "bg-green-500 text-white",
        });
      },
      onError: (e: any) => {
        toast({
          title: "Error",
          description: e.message || "Something went wrong !",
          variant: "destructive",
        });
      },
    }),
  };
};
