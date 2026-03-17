import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SectionBuilder } from "@/components/worksheet/SectionBuilder";
import { Plus, Save, ArrowLeft } from "lucide-react";
import { Worksheet, WorksheetSection, SectionLayout } from "@/types/worksheet.type";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getWorkSheet, saveWorkSheet, updateWorkSheet } from "@/services/worksheet.services";
import routes from "@/routes/routeList";
import { createRandomId } from "@/utils/cryptog";

export default function WorksheetBuilder() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const location = useLocation()
  const id = location.state as string
  // const worksheet = location.state as Worksheet
  const [worksheetName, setWorksheetName] = useState("");
  const [description, setDescription] = useState("");
  const [sections, setSections] = useState<WorksheetSection[]>([]);

  const { data: worksheetResponse } = useQuery({
    queryKey: ["worksheet", id],
    queryFn: () => getWorkSheet(id),
    enabled: !!id,
  });

  const worksheet = worksheetResponse?.data;
  const isEditMode = Boolean(id);
  const workSheetSave = useMutation({
    mutationFn: saveWorkSheet,
    onSuccess: (result) => {
      toast({
        title: "Success",
        description: result?.message || "Worksheet created successfully",
        className: "bg-green-500 text-white",
      });
      navigate(routes.worksheet);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error?.message || "Opps! Something went wrong",
        className: "bg-red-500 text-white",
      });
    },
  });

  const workSheetUpdate = useMutation({
    mutationFn: updateWorkSheet,
    onSuccess: (result) => {
      toast({
        title: "Success",
        description: result?.message || "Worksheet updated successfully",
        className: "bg-green-500 text-white",
      });
      navigate(routes.worksheet);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error?.message || "Opps! Something went wrong",
        className: "bg-red-500 text-white",
      });
    },
  });

  const cleanSection = (section: any): WorksheetSection => ({
    section_id: section.section_id,
    name: section.name || "",
    layout: (section.layout || 1) as SectionLayout,
    fields: (section.fields || []).map((field: any) => ({
      field_id: field.field_id,
      name: field.name || "",
      type: field.type || "textfield",
      required: Boolean(field.required),
      in_report: field.in_report !== false,
      options: (field.options || []).map((opt: any) => ({
        option_id: opt.option_id,
        value: opt.value || "",
      })),
      table_columns: (field.table_columns || []).map((col: any) => ({
        column_id: col.column_id,
        name: col.name || "",
        type: col.type || "textfield",
        options: (col.options || []).map((opt: any) => ({
          option_id: opt.option_id,
          value: opt.value || "",
        })),
      })),
      table_actions: field.table_actions || { edit: false, view: false, delete: false },
    })),
  });

  useEffect(() => {
    if (isEditMode && worksheet) {
      setWorksheetName(worksheet.name || "");
      setDescription(worksheet.description || "");
      const cleanedSections = (worksheet.sections || []).map(cleanSection);
      setSections(cleanedSections);
    }
  }, [worksheet, isEditMode]);

  const addSection = () => {
    const newSection: WorksheetSection = {
      section_id: createRandomId("SECTION"),
      name: "",
      layout: 1,
      fields: [],
    };
    setSections([...sections, newSection]);
  };

  const updateSection = (
    section_id: string,
    updatedSection: WorksheetSection
  ) => {
    setSections(sections.map((s) => (s.section_id === section_id ? updatedSection : s)));
  };

  const deleteSection = (section_id: string) => {
    setSections(sections.filter((s) => s.section_id !== section_id));
  };

  const handleSave = () => {
    if (!worksheetName.trim()) {
      toast({
        title: "Validation Error",
        description: "Please enter a worksheet name.",
        variant: "destructive",
      });
      return;
    }

    if (sections.length === 0) {
      toast({
        title: "Validation Error",
        description: "Please add at least one section.",
        variant: "destructive",
      });
      return;
    }

    const hasEmptySection = sections.some((s) => !s.name.trim());
    if (hasEmptySection) {
      toast({
        title: "Validation Error",
        description: "All sections must have a name.",
        variant: "destructive",
      });
      return;
    }

    const hasEmptyField = sections.some((s) =>
      s.fields.some((f) => !f.name.trim())
    );
    if (hasEmptyField) {
      toast({
        title: "Validation Error",
        description: "All fields must have a name.",
        variant: "destructive",
      });
      return;
    }

    // Prepare payload without createdAt/updatedAt to avoid NestJS validation errors
    const workSheet: any = {
      worksheet_id: id || null,
      name: worksheetName,
      description,
      sections,
      is_active: worksheet ? worksheet.is_active : true,
    };

    console.log("worksheet data=====> ", workSheet);

    if (worksheet?.worksheet_id) {
      workSheetUpdate.mutate(workSheet);
    } else {
      workSheetSave.mutate(workSheet);
    }
  };

  if (isEditMode && !worksheet) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="text-center">
          <p className="text-muted-foreground animate-pulse">Loading worksheet data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-background">
      <div className="flex-1 overflow-auto">
        <div className="container mx-auto p-6 space-y-6 max-w-5xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate(routes.worksheet)}
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold">
                  {isEditMode ? "Edit Worksheet" : "Create New Worksheet"}
                </h1>
                <p className="text-sm text-muted-foreground mt-1">
                  Build your custom worksheet with sections and fields
                </p>
              </div>
            </div>
            <Button 
              onClick={handleSave} 
              size="lg" 
              disabled={workSheetSave.isPending || workSheetUpdate.isPending || (isEditMode && !worksheet)}
            >
              <Save className="h-4 w-4 mr-2" />
              {workSheetSave.isPending || workSheetUpdate.isPending ? "Saving..." : "Save Worksheet"}
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Worksheet Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="worksheet-name">Worksheet Name</Label>
                <Input
                  id="worksheet-name"
                  value={worksheetName}
                  onChange={(e) => setWorksheetName(e.target.value)}
                  placeholder="Enter worksheet name"
                />
                <Label htmlFor="worksheet-description">Description</Label>
                <Input
                  id="worksheet-description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter worksheet description"
                />
              </div>
            </CardContent>
          </Card>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Sections</h2>
              <Button onClick={addSection} variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Add Section
              </Button>
            </div>

            {sections.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <p className="text-muted-foreground mb-4">
                    No sections added yet. Create your first section to get
                    started.
                  </p>
                  <Button onClick={addSection}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Section
                  </Button>
                </CardContent>
              </Card>
            ) : (
              sections.map((section) => (
                <SectionBuilder
                  key={section.section_id}
                  section={section}
                  onUpdate={(updatedSection) =>
                    updateSection(section.section_id, updatedSection)
                  }
                  onDelete={() => deleteSection(section.section_id)}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
