import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useTheme } from "@/contexts/ThemeContext";
import { useToast } from "@/hooks/use-toast";
import { Palette, Type, Layout, Monitor, Smartphone, Tablet } from "lucide-react";

const ThemeSettings = () => {
  const { theme, updateTheme, resetTheme } = useTheme();
  const { toast } = useToast();

  const primaryColors = [
    { name: "Teal", value: "174 77% 56%", preview: "bg-[hsl(174,77%,56%)]" },
    { name: "Blue", value: "217 91% 60%", preview: "bg-[hsl(217,91%,60%)]" },
    { name: "Green", value: "142 71% 45%", preview: "bg-[hsl(142,71%,45%)]" },
    { name: "Purple", value: "262 83% 58%", preview: "bg-[hsl(262,83%,58%)]" },
    { name: "Red", value: "0 84% 60%", preview: "bg-[hsl(0,84%,60%)]" },
    { name: "Orange", value: "25 95% 53%", preview: "bg-[hsl(25,95%,53%)]" },
  ];

  const fonts = [
    { name: "Inter", value: "Inter, system-ui, sans-serif" },
    { name: "Roboto", value: "Roboto, system-ui, sans-serif" },
    { name: "Poppins", value: "Poppins, system-ui, sans-serif" },
    { name: "Open Sans", value: "Open Sans, system-ui, sans-serif" },
    { name: "Montserrat", value: "Montserrat, system-ui, sans-serif" },
    { name: "Nunito", value: "Nunito, system-ui, sans-serif" },
  ];

  const handleSaveTheme = () => {
    toast({
      title: "Theme Saved",
      description: "Your theme preferences have been saved successfully.",
    });
  };

  const handleResetTheme = () => {
    resetTheme();
    toast({
      title: "Theme Reset",
      description: "Theme has been reset to default settings.",
    });
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Theme Settings</h1>
        <p className="text-muted-foreground">
          Customize the appearance and feel of your ERP system
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Color Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="h-5 w-5" />
              Color Theme
            </CardTitle>
            <CardDescription>
              Choose your preferred primary color for the interface
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-3">
              {primaryColors.map((color) => (
                <button
                  key={color.name}
                  onClick={() => updateTheme({ primaryColor: color.value })}
                  className={`group relative p-3 rounded-lg border-2 transition-all ${
                    theme.primaryColor === color.value
                      ? "border-primary shadow-md"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <div className={`w-full h-8 rounded ${color.preview} mb-2`} />
                  <p className="text-xs font-medium">{color.name}</p>
                  {theme.primaryColor === color.value && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-primary rounded-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-primary-foreground rounded-full" />
                    </div>
                  )}
                </button>
              ))}
            </div>

            {/* Custom Color Input */}
            <div className="pt-4 border-t">
              <Label className="text-sm font-medium">Custom Color (HSL)</Label>
              <div className="flex gap-2 mt-2">
                <input
                  type="text"
                  placeholder="174 77% 56%"
                  value={theme.primaryColor}
                  onChange={(e) => updateTheme({ primaryColor: e.target.value })}
                  className="flex-1 px-3 py-2 text-sm border border-input rounded-md"
                />
                <div 
                  className="w-10 h-10 rounded border"
                  style={{ backgroundColor: `hsl(${theme.primaryColor})` }}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Typography Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Type className="h-5 w-5" />
              Typography
            </CardTitle>
            <CardDescription>
              Customize fonts and text sizes for better readability
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Font Family */}
            <div>
              <Label className="text-sm font-medium mb-3 block">Font Family</Label>
              <RadioGroup
                value={theme.fontFamily}
                onValueChange={(value) => updateTheme({ fontFamily: value })}
                className="space-y-2"
              >
                {fonts.map((font) => (
                  <div key={font.name} className="flex items-center space-x-2">
                    <RadioGroupItem value={font.value} id={font.name} />
                    <Label
                      htmlFor={font.name}
                      className="flex-1 cursor-pointer"
                      style={{ fontFamily: font.value }}
                    >
                      {font.name}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            {/* Font Size */}
            <div>
              <Label className="text-sm font-medium mb-3 block">Font Size</Label>
              <RadioGroup
                value={theme.fontSize}
                onValueChange={(value: 'small' | 'medium' | 'large') => updateTheme({ fontSize: value })}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="small" id="small" />
                  <Label htmlFor="small">Small (14px)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="medium" id="medium" />
                  <Label htmlFor="medium">Medium (16px)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="large" id="large" />
                  <Label htmlFor="large">Large (18px)</Label>
                </div>
              </RadioGroup>
            </div>
          </CardContent>
        </Card>

        {/* Layout Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Layout className="h-5 w-5" />
              Layout & Spacing
            </CardTitle>
            <CardDescription>
              Adjust border radius and component spacing
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Border Radius */}
            <div className="mb-6">
              <Label className="text-sm font-medium mb-3 block">Border Radius</Label>
              <RadioGroup
                value={theme.borderRadius}
                onValueChange={(value: 'small' | 'medium' | 'large') => updateTheme({ borderRadius: value })}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="small" id="radius-small" />
                  <Label htmlFor="radius-small">Small (6px)</Label>
                  <div className="ml-auto w-8 h-8 bg-primary rounded-sm" />
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="medium" id="radius-medium" />
                  <Label htmlFor="radius-medium">Medium (12px)</Label>
                  <div className="ml-auto w-8 h-8 bg-primary rounded-md" />
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="large" id="radius-large" />
                  <Label htmlFor="radius-large">Large (16px)</Label>
                  <div className="ml-auto w-8 h-8 bg-primary rounded-lg" />
                </div>
              </RadioGroup>
            </div>

            {/* Theme Mode */}
            <div className="pt-6 border-t">
              <Label className="text-sm font-medium mb-3 block">Theme Mode</Label>
              <RadioGroup
                value={theme.themeMode || "dark"}
                onValueChange={(value: 'light' | 'dark') => updateTheme({ themeMode: value })}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="light" id="theme-light" />
                  <Label htmlFor="theme-light">Light Mode</Label>
                </div>
                <div className="flex items-center space-x-2 mt-2">
                  <RadioGroupItem value="dark" id="theme-dark" />
                  <Label htmlFor="theme-dark">Dark Mode</Label>
                </div>
              </RadioGroup>
            </div>
          </CardContent>
        </Card>

        {/* Preview Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Monitor className="h-5 w-5" />
              Live Preview
            </CardTitle>
            <CardDescription>
              See how your theme changes look in real-time
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 p-4 border rounded-lg bg-background">
              {/* Sample Header */}
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Sample Header</h3>
                <Button size="sm">Primary Button</Button>
              </div>
              
              {/* Sample Content */}
              <div className="grid grid-cols-2 gap-4">
                <Card className="p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-3 h-3 bg-primary rounded-full" />
                    <span className="text-sm font-medium">Sample Metric</span>
                  </div>
                  <div className="text-xl font-bold">1,234</div>
                  <div className="text-xs text-success">+12.5%</div>
                </Card>
                <Card className="p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-3 h-3 bg-warning rounded-full" />
                    <span className="text-sm font-medium">Another Metric</span>
                  </div>
                  <div className="text-xl font-bold">567</div>
                  <div className="text-xs text-error">-3.2%</div>
                </Card>
              </div>

              {/* Sample List */}
              <div className="space-y-2">
                <div className="flex items-center gap-3 p-2 rounded hover:bg-muted/50">
                  <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                    <span className="text-xs font-medium text-primary">A</span>
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium">Sample List Item</div>
                    <div className="text-xs text-muted-foreground">Description text</div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-4 pt-6 border-t">
        <Button onClick={handleSaveTheme} className="min-w-[120px]">
          Save Theme
        </Button>
        <Button variant="outline" onClick={handleResetTheme}>
          Reset to Default
        </Button>
        <div className="ml-auto text-sm text-muted-foreground">
          Changes are applied instantly and saved locally
        </div>
      </div>
    </div>
  );
};

export default ThemeSettings;