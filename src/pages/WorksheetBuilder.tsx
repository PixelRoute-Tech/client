import { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SectionBuilder } from "@/components/worksheet/SectionBuilder";
import { Plus, Save, ArrowLeft } from "lucide-react";
import { Worksheet, WorksheetSection } from "@/types/worksheet";
import { worksheetStorage } from "@/utils/worksheetStorage";
import { useToast } from "@/hooks/use-toast";
import routes from "@/routes/routeList";
import { useMutation } from "@tanstack/react-query";
import { saveWorkSheet, updateWorkSheet } from "@/services/worksheet.services";

export default function WorksheetBuilder() {
  const navigate = useNavigate();
  const location = useLocation()
  const workSheet = location.state as Worksheet
  const { toast } = useToast();
  const isEditMode = !!workSheet;

  const [worksheetName, setWorksheetName] = useState("");
  const [sections, setSections] = useState<WorksheetSection[]>([]);

  const workSheetSave = useMutation({
    mutationFn: saveWorkSheet,
    onSuccess: (result) => {
      toast({
        title: "Success",
        description: result.message,
        className: "bg-green-500 text-white",
      });
      navigate(routes.worksheet);
    },
    onError: (error: any) => {
      toast({
        title: "",
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
        description: result.message,
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

  useEffect(() => {
    if (isEditMode && workSheet.workSheetId) {
      if (workSheet) {
        setWorksheetName(workSheet.name);
        setSections(workSheet.sections);
      } else {
        toast({
          title: "Worksheet not found",
          description: "The worksheet you are trying to edit does not exist.",
          variant: "destructive",
        });
        navigate(routes.worksheet);
      }
    }
  }, [workSheet?.workSheetId, isEditMode, navigate, toast]);

  const addSection = () => {
    const newSection: WorksheetSection = {
      sectionId: crypto.randomUUID(),
      name: "",
      fields: [],
    };
    setSections([...sections, newSection]);
  };

  const updateSection = (
    sectionId: string,
    updatedSection: WorksheetSection
  ) => {
    setSections(
      sections.map((s) => (s.sectionId === sectionId ? updatedSection : s))
    );
  };

  const deleteSection = (sectionId: string) => {
    setSections(sections.filter((s) => s.sectionId !== sectionId));
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

    const worksheet: Worksheet = {
      workSheetId: workSheet?.workSheetId || null,
      name: worksheetName,
      sections,
      isActive: true,
      createdAt: workSheet?.workSheetId
        ? workSheet?.workSheetId || new Date().toISOString()
        : new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    console.log(worksheet);
    if(worksheet.workSheetId){
        workSheetUpdate.mutate(worksheet)
    }else{
      workSheetSave.mutate(worksheet)
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/worksheets")}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">
              {isEditMode ? "Edit Worksheet" : "Create New Worksheet"}
            </h1>
            <p className="text-muted-foreground mt-1">
              Build your custom worksheet with sections and fields
            </p>
          </div>
        </div>
        <Button onClick={handleSave}>
          <Save className="h-4 w-4 mr-2" />
          Save Worksheet
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
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Sections</h2>
          <Button onClick={addSection} variant="outline">
            <Plus className="h-4 w-4 mr-2" />
            Create New Section
          </Button>
        </div>

        {sections.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <p className="text-muted-foreground mb-4">
                No sections added yet. Create your first section to get started.
              </p>
              <Button onClick={addSection}>
                <Plus className="h-4 w-4 mr-2" />
                Create New Section
              </Button>
            </CardContent>
          </Card>
        ) : (
          sections.map((section) => (
            <SectionBuilder
              key={section.sectionId}
              section={section}
              onUpdate={(updatedSection) =>
                updateSection(section.sectionId, updatedSection)
              }
              onDelete={() => deleteSection(section.sectionId)}
            />
          ))
        )}
      </div>
    </div>
  );
}
