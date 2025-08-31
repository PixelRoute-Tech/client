import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Eye, EyeOff, Save, X } from "lucide-react";

const Forms = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    phone: "",
    country: "",
    description: "",
    newsletter: false,
    terms: false,
    plan: "",
  });
  const { toast } = useToast();

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validateForm = () => {
    const errors = [];
    
    if (!formData.email) {
      errors.push("Email is required");
    } else if (!validateEmail(formData.email)) {
      errors.push("Please enter a valid email address");
    }
    
    if (!formData.password) {
      errors.push("Password is required");
    } else if (formData.password.length < 6) {
      errors.push("Password must be at least 6 characters");
    }
    
    if (formData.password !== formData.confirmPassword) {
      errors.push("Passwords do not match");
    }
    
    if (!formData.firstName) {
      errors.push("First name is required");
    }
    
    if (!formData.terms) {
      errors.push("You must accept the terms and conditions");
    }
    
    return errors;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errors = validateForm();
    
    if (errors.length > 0) {
      toast({
        title: "Form Validation Error",
        description: errors[0],
        variant: "destructive",
      });
      return;
    }
    
    toast({
      title: "Form Submitted Successfully",
      description: "Your information has been saved.",
    });
  };

  const handleReset = () => {
    setFormData({
      email: "",
      password: "",
      confirmPassword: "",
      firstName: "",
      lastName: "",
      phone: "",
      country: "",
      description: "",
      newsletter: false,
      terms: false,
      plan: "",
    });
    toast({
      title: "Form Reset",
      description: "All fields have been cleared.",
    });
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Forms Validation</h1>
        <p className="text-muted-foreground">
          Comprehensive form validation examples with real-time feedback
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Registration Form */}
        <Card>
          <CardHeader>
            <CardTitle>User Registration</CardTitle>
            <CardDescription>
              Complete the form below to create your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email address"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className={!formData.email || validateEmail(formData.email) ? "" : "border-error"}
                />
                {formData.email && !validateEmail(formData.email) && (
                  <p className="text-sm text-error">Please enter a valid email address</p>
                )}
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="password">Password *</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className={formData.password.length === 0 || formData.password.length >= 6 ? "" : "border-error"}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-1/2 -translate-y-1/2"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
                {formData.password && formData.password.length < 6 && (
                  <p className="text-sm text-error">Password must be at least 6 characters</p>
                )}
              </div>

              {/* Confirm Password */}
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password *</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  className={!formData.confirmPassword || formData.password === formData.confirmPassword ? "" : "border-error"}
                />
                {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                  <p className="text-sm text-error">Passwords do not match</p>
                )}
              </div>

              {/* Name Fields */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name *</Label>
                  <Input
                    id="firstName"
                    placeholder="Enter first name"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    placeholder="Enter last name"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  />
                </div>
              </div>

              {/* Phone */}
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="Enter phone number"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>

              {/* Country Select */}
              <div className="space-y-2">
                <Label htmlFor="country">Country</Label>
                <Select value={formData.country} onValueChange={(value) => setFormData({ ...formData, country: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your country" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="us">United States</SelectItem>
                    <SelectItem value="uk">United Kingdom</SelectItem>
                    <SelectItem value="ca">Canada</SelectItem>
                    <SelectItem value="au">Australia</SelectItem>
                    <SelectItem value="de">Germany</SelectItem>
                    <SelectItem value="fr">France</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Tell us about yourself..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                />
              </div>

              {/* Checkboxes */}
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="newsletter"
                    checked={formData.newsletter}
                    onCheckedChange={(checked) => setFormData({ ...formData, newsletter: !!checked })}
                  />
                  <Label htmlFor="newsletter" className="text-sm">
                    Subscribe to newsletter
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="terms"
                    checked={formData.terms}
                    onCheckedChange={(checked) => setFormData({ ...formData, terms: !!checked })}
                  />
                  <Label htmlFor="terms" className="text-sm">
                    I accept the terms and conditions *
                  </Label>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <Button type="submit" className="flex-1">
                  <Save className="h-4 w-4 mr-2" />
                  Submit Form
                </Button>
                <Button type="button" variant="outline" onClick={handleReset}>
                  <X className="h-4 w-4 mr-2" />
                  Reset
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Form Controls Showcase */}
        <div className="space-y-6">
          {/* Radio Group Example */}
          <Card>
            <CardHeader>
              <CardTitle>Plan Selection</CardTitle>
              <CardDescription>Choose your subscription plan</CardDescription>
            </CardHeader>
            <CardContent>
              <RadioGroup
                value={formData.plan}
                onValueChange={(value) => setFormData({ ...formData, plan: value })}
                className="space-y-3"
              >
                <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-muted/50">
                  <RadioGroupItem value="basic" id="basic" />
                  <div className="flex-1">
                    <Label htmlFor="basic" className="font-medium">Basic Plan</Label>
                    <p className="text-sm text-muted-foreground">Essential features for individuals</p>
                  </div>
                  <Badge variant="secondary">$9/mo</Badge>
                </div>
                <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-muted/50">
                  <RadioGroupItem value="pro" id="pro" />
                  <div className="flex-1">
                    <Label htmlFor="pro" className="font-medium">Pro Plan</Label>
                    <p className="text-sm text-muted-foreground">Advanced features for teams</p>
                  </div>
                  <Badge>$29/mo</Badge>
                </div>
                <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-muted/50">
                  <RadioGroupItem value="enterprise" id="enterprise" />
                  <div className="flex-1">
                    <Label htmlFor="enterprise" className="font-medium">Enterprise</Label>
                    <p className="text-sm text-muted-foreground">Complete solution for organizations</p>
                  </div>
                  <Badge variant="outline">Contact us</Badge>
                </div>
              </RadioGroup>
            </CardContent>
          </Card>

          {/* Form Status Card */}
          <Card>
            <CardHeader>
              <CardTitle>Form Status</CardTitle>
              <CardDescription>Current form validation status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Email</span>
                  <Badge variant={formData.email && validateEmail(formData.email) ? "default" : "secondary"}>
                    {formData.email && validateEmail(formData.email) ? "Valid" : "Required"}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Password</span>
                  <Badge variant={formData.password.length >= 6 ? "default" : "secondary"}>
                    {formData.password.length >= 6 ? "Valid" : "Required"}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">First Name</span>
                  <Badge variant={formData.firstName ? "default" : "secondary"}>
                    {formData.firstName ? "Valid" : "Required"}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Terms Accepted</span>
                  <Badge variant={formData.terms ? "default" : "secondary"}>
                    {formData.terms ? "Accepted" : "Required"}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Forms;