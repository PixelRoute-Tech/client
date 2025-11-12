import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SectionBuilder } from "@/components/worksheet/SectionBuilder";
import { Plus, Save, ArrowLeft } from "lucide-react";
import { Worksheet, WorksheetSection } from "@/types/worksheet";
import { worksheetStorage } from "@/utils/worksheetStorage";
import { useToast } from "@/hooks/use-toast";

export default function WorksheetBuilder() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { toast } = useToast();
  const isEditMode = !!id;

  const [worksheetName, setWorksheetName] = useState("");
  const [sections, setSections] = useState<WorksheetSection[]>([]);

  useEffect(() => {
    if (isEditMode && id) {
      const worksheet = worksheetStorage.getById(id);
      if (worksheet) {
        setWorksheetName(worksheet.name);
        // Add default layout for existing sections without layout field
        const sectionsWithLayout = worksheet.sections.map((section) => ({
          ...section,
          layout: section.layout || 1, // Default to 1 column if not set
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
  }, [id, isEditMode, navigate, toast]);

  const addSection = () => {
    const newSection: WorksheetSection = {
      id: crypto.randomUUID(),
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
    setSections(sections.map((s) => (s.id === sectionId ? updatedSection : s)));
  };

  const deleteSection = (sectionId: string) => {
    setSections(sections.filter((s) => s.id !== sectionId));
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
      id: id || crypto.randomUUID(),
      name: worksheetName,
      sections,
      isActive: true,
      createdAt: id
        ? worksheetStorage.getById(id)?.createdAt || new Date().toISOString()
        : new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    console.log("worksheet data=====> ", worksheet);

    // worksheetStorage.save(worksheet);
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
                  key={section.id}
                  section={section}
                  onUpdate={(updatedSection) =>
                    updateSection(section.id, updatedSection)
                  }
                  onDelete={() => deleteSection(section.id)}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

const data = {
  id: "16ccee06-e578-4b9d-a25c-7ddcf55b9b8b",
  name: "test sheet",
  sections: [
    {
      id: "65c0ba45-ba06-4ac2-af6e-d3bbad6375bc",
      name: "test ",
      layout: 1,
      fields: [
        {
          id: "9b86bb74-725a-494f-be11-6d561a231534",
          name: "f1",
          type: "textfield",
          required: true,
        },
        {
          id: "22d6f398-84e1-4c62-89b1-704534965003",
          name: "f2",
          type: "checkbox",
          required: false,
        },
        {
          id: "daf068b6-7f93-4870-ba0f-c8f834fb9aaf",
          name: "f3",
          type: "radio",
          required: true,
          options: [
            {
              id: "e14d362c-95d8-4c46-be04-6172f68cb788",
              value: "optoin 1",
            },
            {
              id: "68e315d0-8a82-46ce-9283-110f5dd35dbf",
              value: "option 2",
            },
          ],
        },
        {
          id: "e6bc60dd-4a8a-40fa-8ebd-3cf2f6bd6bf6",
          name: "f4",
          type: "textarea",
          required: false,
        },
        {
          id: "f99d6bcb-99ac-4b39-b85d-40b4792b9c17",
          name: "f5",
          type: "select",
          required: false,
          options: [
            {
              id: "bce6f92c-b3dd-4c6d-a19a-dffb56a90f13",
              value: "option 1",
            },
            {
              id: "9ebee604-a862-459a-8945-fa97ba363b77",
              value: "option 2",
            },
          ],
        },
        {
          id: "5cef117d-a185-4bb8-957f-50f337abfef6",
          name: "f6",
          type: "autocomplete",
          required: false,
          options: [
            {
              id: "c4b6c830-c445-4f2a-b7ea-960af6a721aa",
              value: "option 1",
            },
            {
              id: "b48a1c28-1f44-4f7e-81f8-dacb58a3bc71",
              value: "option 2",
            },
          ],
        },
        {
          id: "30ab91b0-b53f-49a4-8935-9436004764d7",
          name: "f7",
          type: "autocomplete-chips",
          required: false,
          options: [
            {
              id: "3be91ba3-c2eb-43a8-a72e-6c7c0ef2d267",
              value: "option 1",
            },
            {
              id: "8c3059ff-8066-480c-9418-cd769e029fdf",
              value: "option 2",
            },
          ],
        },
        {
          id: "8c47415c-49f1-401c-bc8a-9ac7220e84e6",
          name: "f8",
          type: "file",
          required: false,
        },
        {
          id: "e9e79c19-fecf-4d60-afba-c1fd2dc21044",
          name: "f9",
          type: "table",
          required: false,
          tableColumns: [
            {
              id: "4ed53b46-2cf5-4f0d-b47e-330d978ff9c5",
              name: "c1",
              type: "textfield",
            },
            {
              id: "d6249253-6d9e-4946-85cd-bebb716cdd00",
              name: "c2",
              type: "textarea",
            },
            {
              id: "236e3cc2-5d82-4a10-8898-3719e4fc71db",
              name: "c3",
              type: "select",
              options: [
                {
                  id: "3e7802c5-e5e6-4a6f-9953-62d6518bebaf",
                  value: "option 1",
                },
                {
                  id: "b0290385-f727-45b6-83b2-9e04dc5a3fc7",
                  value: "option 2",
                },
              ],
            },
            {
              id: "54adf86a-0874-4bec-aedb-f92bf6789d7c",
              name: "c4",
              type: "checkbox",
            },
          ],
          tableActions: {
            edit: true,
            view: true,
            delete: true,
          },
        },
      ],
    },
  ],
  isActive: true,
  createdAt: "2025-11-12T15:31:21.386Z",
  updatedAt: "2025-11-12T15:31:21.387Z",
};
