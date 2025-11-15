import { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SectionBuilder } from "@/components/worksheet/SectionBuilder";
import { Plus, Save, ArrowLeft } from "lucide-react";
import { Worksheet, WorksheetSection } from "@/types/worksheet.type";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { saveWorkSheet, updateWorkSheet } from "@/services/worksheet.services";
import routes from "@/routes/routeList";
import moment from "moment";

export default function WorksheetBuilder() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const location = useLocation()
  const worksheet = location.state as Worksheet
  const [worksheetName, setWorksheetName] = useState("");
  const [description, setDescription] = useState("");
  const [sections, setSections] = useState<WorksheetSection[]>([]);
  const isEditMode = Boolean(worksheet);

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
    if (isEditMode && worksheet?.workSheetId) {
      if (worksheet) {
        setWorksheetName(worksheet.name);
        setDescription(worksheet.description || "")
        // Add default layout for existing sections without layout field
        const sectionsWithLayout = worksheet.sections.map((section) => ({
          ...section,
          layout: section?.layout || 1, // Default to 1 column if not set
        }));
        setSections(sectionsWithLayout);
      } else {
        toast({
          title: "Worksheet not found",
          description: "The worksheet you are trying to edit does not exist.",
          variant: "destructive",
        });
        navigate("/worksheets");
      }
    }
  }, [worksheet?.workSheetId, isEditMode, navigate, toast]);

  const addSection = () => {
    const newSection: WorksheetSection = {
      sectionId: crypto.randomUUID(),
      name: "",
      layout: 1,
      fields: [],
    };
    setSections([...sections, newSection]);
  };

  const updateSection = (
    sectionId: string,
    updatedSection: WorksheetSection
  ) => {
    setSections(sections.map((s) => (s.sectionId === sectionId ? updatedSection : s)));
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

    const workSheet: Worksheet = {
      workSheetId: worksheet?.workSheetId || null,
      name: worksheetName,
      description,
      sections,
      isActive: true,
      createdAt: worksheet?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    console.log("worksheet data=====> ", workSheet);

    if (worksheet?.workSheetId) {
      workSheetUpdate.mutate(workSheet);
    } else {
      workSheetSave.mutate(workSheet);
    }
    toast({
      title: "Success",
      description: `Worksheet ${
        isEditMode ? "updated" : "created"
      } successfully.`,
    });
    navigate("/worksheets");
  };

  return (
    <div className="flex h-screen bg-background">
      {/* Components Panel */}
      <div className="w-64 border-r bg-card p-4 overflow-y-auto">
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Components</h2>
          <div className="space-y-2">
            <div className="text-sm text-muted-foreground mb-2">
              Field Types
            </div>
            {[
              { icon: "📝", label: "Text Input" },
              { icon: "📄", label: "Text Area" },
              { icon: "▼", label: "Dropdown" },
              { icon: "📅", label: "Date Picker" },
              { icon: "☑️", label: "Checkbox" },
              { icon: "⊞", label: "Table" },
            ].map((component, idx) => (
              <div
                key={idx}
                className="flex items-center gap-3 p-3 border rounded-lg hover:bg-accent cursor-pointer transition-colors"
              >
                <span className="text-xl">{component.icon}</span>
                <span className="text-sm font-medium">{component.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Canvas */}
      <div className="flex-1 overflow-auto">
        <div className="container mx-auto p-6 space-y-6 max-w-5xl">
          {/* Header */}
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
                <h1 className="text-2xl font-bold">
                  {isEditMode ? "Edit Worksheet" : "Create New Worksheet"}
                </h1>
                <p className="text-sm text-muted-foreground mt-1">
                  Build your custom worksheet with sections and fields
                </p>
              </div>
            </div>
            <Button onClick={handleSave} size="lg">
              <Save className="h-4 w-4 mr-2" />
              Save Worksheet
            </Button>
          </div>

          {/* Worksheet Name */}
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
                  placeholder="Enter worksheet name"
                />
              </div>
            </CardContent>
          </Card>

          {/* Sections */}
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
      </div>
    </div>
  );
}
