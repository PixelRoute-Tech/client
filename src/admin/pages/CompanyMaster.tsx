import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { companyStorage } from "@/utils/companyStorage";
import { toast, useToast } from "@/hooks/use-toast";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import CompanyForm from "../components/CompanyForm";
import CompaniesTable from "../components/CompaniesTable";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getCompany, saveCompany } from "../services/services";
import { Company } from "../types/company.type";

export default function CompanyMaster() {
  const [editingCompany, setEditingCompany] = useState<Company | null>(null);
  const [activeTab, setActiveTab] = useState("add");

  const { toast } = useToast();
  const { data: companies,refetch } = useQuery({
    queryKey: ["companiesforlist"],
    queryFn: getCompany,
  });

  const { mutate: save } = useMutation({
    mutationFn: saveCompany,
    onSuccess: () => {
      refetch()
      toast({
        description: "success",
      });
    },
    onError:()=>{
   toast({
        description: "error",
      });
    }
  });
  const handleSubmit = (data: any) => {
    save(data);
    // console.log(data)
  };

  const handleEdit = (company: Company) => {
    setEditingCompany(company);
    setActiveTab("add");
  };

  const handleDelete = (id: string) => {
    const deleted = companyStorage.delete(id);
    if (deleted) {
      toast({
        title: "Success",
        description: "Company deleted successfully",
      });
    }
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    if (value === "add" && editingCompany) {
      setEditingCompany(null);
    }
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto py-6">
        <h1 className="text-3xl font-bold mb-6">Company Master</h1>
        <Tabs value={activeTab} onValueChange={handleTabChange}>
          <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto mb-8">
            <TabsTrigger value="add">
              {editingCompany ? "Edit Company" : "Add Company"}
            </TabsTrigger>
            <TabsTrigger value="list">Companies List</TabsTrigger>
          </TabsList>

          <TabsContent value="add">
            <CompanyForm
              onSubmit={handleSubmit}
              initialData={editingCompany || undefined}
              isEditing={!!editingCompany}
            />
          </TabsContent>

          <TabsContent value="list">
            <CompaniesTable
              companies={companies?.data || []}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
