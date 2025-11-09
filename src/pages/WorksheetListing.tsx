import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Plus, Edit, Trash2, Power, PowerOff } from 'lucide-react';
import { Worksheet } from '@/types/worksheet';
import { worksheetStorage } from '@/utils/worksheetStorage';
import { useToast } from '@/hooks/use-toast';
import { useQuery } from '@tanstack/react-query';
import { getWorkSheets } from '@/services/worksheet.services';
import routes from '@/routes/routeList';

export default function WorksheetListing() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [deleteId, setDeleteId] = useState<string | null>(null);


  const {data:worksheets,refetch} = useQuery({queryKey:["worksheetlist"],queryFn:getWorkSheets})

  const handleDelete = () => {
    if (deleteId) {
      worksheetStorage.delete(deleteId);
      refetch();
      toast({
        title: 'Worksheet deleted',
        description: 'The worksheet has been successfully deleted.',
      });
      setDeleteId(null);
    }
  };

  const handleToggleActive = (id: string) => {
    worksheetStorage.toggleActive(id);
    refetch();
    toast({
      title: 'Status updated',
      description: 'Worksheet status has been updated.',
    });
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Worksheet Master</h1>
          <p className="text-muted-foreground mt-1">
            Create and manage custom worksheets
          </p>
        </div>
        <Button onClick={() => navigate('/worksheets/new')}>
          <Plus className="h-4 w-4 mr-2" />
          Create New Worksheet
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Worksheets</CardTitle>
        </CardHeader>
        <CardContent>
          {worksheets?.data?.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">
                No worksheets found. Create your first worksheet to get started.
              </p>
              <Button onClick={() => navigate('/worksheets/new')}>
                <Plus className="h-4 w-4 mr-2" />
                Create Worksheet
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Worksheet Name</TableHead>
                  <TableHead>Sections</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {worksheets?.data?.map(worksheet => (
                  <TableRow key={worksheet.workSheetId}>
                    <TableCell className="font-medium">{worksheet.name}</TableCell>
                    <TableCell>{worksheet.sections.length}</TableCell>
                    <TableCell>
                      <Badge variant={worksheet.isActive ? 'default' : 'secondary'}>
                        {worksheet.isActive ? 'Active' : 'Disabled'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(worksheet.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => navigate(`${routes.worksheetEdit}`,{state:worksheet})}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleToggleActive(worksheet.workSheetId)}
                        >
                          {worksheet.isActive ? (
                            <PowerOff className="h-4 w-4" />
                          ) : (
                            <Power className="h-4 w-4" />
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setDeleteId(worksheet.workSheetId)}
                          className="text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Worksheet</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this worksheet? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
