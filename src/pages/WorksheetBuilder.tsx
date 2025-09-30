import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SectionBuilder } from '@/components/worksheet/SectionBuilder';
import { Plus, Save, ArrowLeft } from 'lucide-react';
import { Worksheet, WorksheetSection } from '@/types/worksheet';
import { worksheetStorage } from '@/utils/worksheetStorage';
import { useToast } from '@/hooks/use-toast';

export default function WorksheetBuilder() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { toast } = useToast();
  const isEditMode = !!id;

  const [worksheetName, setWorksheetName] = useState('');
  const [sections, setSections] = useState<WorksheetSection[]>([]);

  useEffect(() => {
    if (isEditMode && id) {
      const worksheet = worksheetStorage.getById(id);
      if (worksheet) {
        setWorksheetName(worksheet.name);
        setSections(worksheet.sections);
      } else {
        toast({
          title: 'Worksheet not found',
          description: 'The worksheet you are trying to edit does not exist.',
          variant: 'destructive',
        });
        navigate('/worksheets');
      }
    }
  }, [id, isEditMode, navigate, toast]);

  const addSection = () => {
    const newSection: WorksheetSection = {
      id: crypto.randomUUID(),
      name: '',
      fields: [],
    };
    setSections([...sections, newSection]);
  };

  const updateSection = (sectionId: string, updatedSection: WorksheetSection) => {
    setSections(sections.map(s => s.id === sectionId ? updatedSection : s));
  };

  const deleteSection = (sectionId: string) => {
    setSections(sections.filter(s => s.id !== sectionId));
  };

  const handleSave = () => {
    if (!worksheetName.trim()) {
      toast({
        title: 'Validation Error',
        description: 'Please enter a worksheet name.',
        variant: 'destructive',
      });
      return;
    }

    if (sections.length === 0) {
      toast({
        title: 'Validation Error',
        description: 'Please add at least one section.',
        variant: 'destructive',
      });
      return;
    }

    const hasEmptySection = sections.some(s => !s.name.trim());
    if (hasEmptySection) {
      toast({
        title: 'Validation Error',
        description: 'All sections must have a name.',
        variant: 'destructive',
      });
      return;
    }

    const hasEmptyField = sections.some(s => 
      s.fields.some(f => !f.name.trim())
    );
    if (hasEmptyField) {
      toast({
        title: 'Validation Error',
        description: 'All fields must have a name.',
        variant: 'destructive',
      });
      return;
    }

    const worksheet: Worksheet = {
      id: id || crypto.randomUUID(),
      name: worksheetName,
      sections,
      isActive: true,
      createdAt: id ? worksheetStorage.getById(id)?.createdAt || new Date().toISOString() : new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    worksheetStorage.save(worksheet);
    toast({
      title: 'Success',
      description: `Worksheet ${isEditMode ? 'updated' : 'created'} successfully.`,
    });
    navigate('/worksheets');
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/worksheets')}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">
              {isEditMode ? 'Edit Worksheet' : 'Create New Worksheet'}
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
          sections.map(section => (
            <SectionBuilder
              key={section.id}
              section={section}
              onUpdate={(updatedSection) => updateSection(section.id, updatedSection)}
              onDelete={() => deleteSection(section.id)}
            />
          ))
        )}
      </div>
    </div>
  );
}
