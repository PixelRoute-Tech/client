import { useState, useRef } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Upload, Camera, Link as LinkIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { CameraCapture } from './CameraCapture';

interface ImageUploadModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpload: (file: File | string, type: 'Drawing' | 'Photo', description: string) => void;
  loading?:boolean
}

export const ImageUploadModal = ({
  open,
  onOpenChange,
  onUpload,
  loading
}: ImageUploadModalProps) => {
  const [imageType, setImageType] = useState<'Drawing' | 'Photo'>('Photo');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [urlInput, setUrlInput] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileChange = (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast({
        title: 'Invalid file',
        description: 'Please select an image file',
        variant: 'destructive',
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      setImageUrl(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileChange(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleUrlSubmit = () => {
    if (urlInput.trim()) {
      setImageUrl(urlInput.trim());
      // setUrlInput('');
    }
  };

  const handleSubmit = () => {
    if (!imageUrl) {
      toast({
        title: 'No image',
        description: 'Please select or provide an image',
        variant: 'destructive',
      });
      return;
    }
   if(urlInput){
     onUpload(urlInput, imageType, description);
    }else{
     onUpload(fileInputRef.current.files[0], imageType, description);
   }

    
    // Reset form
    setImageUrl('');
    setDescription('');
    setUrlInput('');
    setImageType('Photo');
    onOpenChange(false);
    
  
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Add New Image</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Image Upload Area */}
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              isDragging ? 'border-primary bg-primary/5' : 'border-border'
            }`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
          >
            {imageUrl ? (
              <div className="space-y-3">
                <img
                  src={imageUrl}
                  alt="Preview"
                  className="max-h-64 mx-auto rounded-lg object-contain"
                />
                <Button
                  variant="outline"
                  onClick={() => setImageUrl('')}
                  size="sm"
                >
                  Change Image
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <Upload className="h-12 w-12 mx-auto text-muted-foreground" />
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    Drag and drop an image here, or click to browse
                  </p>
                  <div className="flex gap-2 justify-center flex-wrap">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Browse Files
                    </Button>
                    {/* <Button
                      variant="outline"
                      size="sm"
                      onClick={() => cameraInputRef.current?.click()}
                    >
                      <Camera className="h-4 w-4 mr-2" />
                      Take Photo
                    </Button> */}
                  </div>
                </div>
              </div>
            )}
            
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFileChange(file);
              }}
            />
            {/* <input
              ref={cameraInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFileChange(file);
              }}
            /> */}
          </div>

          {/* URL Input */}
          <div className="space-y-2">
            <Label>Or add image from URL</Label>
            <div className="flex gap-2">
              <Input
                placeholder="https://example.com/image.jpg"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleUrlSubmit()}
              />
              <Button onClick={handleUrlSubmit} variant="outline">
                <LinkIcon className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Image Type */}
          <div className="space-y-2">
            <Label>Image Type</Label>
            <RadioGroup
              value={imageType}
              onValueChange={(value) => setImageType(value as 'Drawing' | 'Photo')}
              className="flex gap-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Photo" id="photo" />
                <Label htmlFor="photo" className="cursor-pointer">Photo</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Drawing" id="drawing" />
                <Label htmlFor="drawing" className="cursor-pointer">Drawing</Label>
              </div>
            </RadioGroup>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label>Description (Optional)</Label>
            <Textarea
              placeholder="Add a description for this image..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button loading={loading} onClick={handleSubmit}>Add Image</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
