import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Link } from "react-router-dom";
import { Eye, EyeOff, Loader, LogIn } from "lucide-react";
import { setItem, storageKeys } from "@/utils/storage";
import { useAuth } from "@/hooks/useAuth";
import FormInput from "@/components/forms/fields/FormInput";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import FormCheckbox from "@/components/forms/fields/FormCheckbox";
import { useToast } from "@/hooks/use-toast";
import { AxiosError } from "axios";
import { useTheme } from "@/contexts/ThemeContext";
import { baseURL } from "@/config/network.config";
import { loginServices } from "@/services/auth.services";

const Login = () => {
  const { signin } = useAuth();
  const { updateTheme } = useTheme();
  const { control, handleSubmit } = useForm<{
    email: string;
    password: string;
  }>({
    defaultValues: {
      email: null,
      password: null,
    },
  });
  const { toast } = useToast();
  const { mutate, isPending } = useMutation({
    mutationFn: loginServices,
    onSuccess: (result) => {
      signin(result.data);
      updateTheme(result.data.settings);
    },
    onError: (e: any) => {
      toast({
        title: "",
        description: e?.message,
        className: "bg-red-500 text-white",
      });
    },
  });

  const loginWithGoogle = () => {
    window.location.href = `${baseURL}/api/dummy/google`;
  };

  const onSubmit = (e: { email: string; password: string }) => {
    mutate(e);
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-info/5 to-success/10" />
      <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-primary/20 to-transparent rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-info/20 to-transparent rounded-full blur-3xl transform translate-x-1/2 translate-y-1/2" />

      {/* Login Card */}
      <Card className="w-full max-w-md mx-4 backdrop-blur-sm bg-card/80 border-border/50 shadow-2xl">
        <CardHeader className="text-center pb-8">
          {/* Logo */}
          <div className="mx-auto w-16 h-16 bg-primary text-primary-foreground rounded-2xl flex items-center justify-center mb-4">
            <span className="text-2xl font-bold">M</span>
          </div>
          <CardTitle className="text-2xl font-bold">Login</CardTitle>
          <CardDescription>
            Welcome back! Please sign in to your account
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <FormInput
                control={control}
                name="email"
                label="Email"
                placeholder="Enter Email"
                type="email"
                rules={{ required: "Email required" }}
              />
            </div>
            <div className="space-y-2">
              <FormInput
                control={control}
                name="password"
                label="Password"
                placeholder="Enter password"
                type="password"
                rules={{ required: "Password required" }}
              />
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              {/* <FormCheckbox
                control={control}
                name="rememberMe"
                label="Keep me signed in"
              /> */}
              <Link
                to="/forgot-password"
                className="text-sm text-primary hover:text-primary/80 transition-colors"
              >
                Forgot Password?
              </Link>
            </div>

            {/* Login Button */}
            <Button
              disabled={isPending}
              type="submit"
              className="w-full h-12 text-base font-medium"
            >
              <LogIn className="h-5 w-5 mr-2" />
              Sign In
              {/* <Loader /> */}
            </Button>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>
            </div>

            {/* Social Login */}
            <div className="flex flex-col gap-2">
              <Button type="button" onClick={loginWithGoogle} size="sm" variant="outline" className="h-12 col-span-full">
                <img src="/icons/google.svg" width={16} height={16} />
                Google
              </Button>
              {/* <Button variant="outline" className="h-12">
               <img src="/icons/apple.svg" width={16} height={16} />
                Apple
              </Button> */}
            </div>

            {/* Sign Up Link */}
            <div className="text-center pt-4">
              <span className="text-sm text-muted-foreground">
                Don't have an account?{" "}
                <Link
                  to="/register"
                  className="text-primary hover:text-primary/80 font-medium transition-colors"
                >
                  Sign up
                </Link>
              </span>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Footer */}
      {/* <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2">
        <p className="text-sm text-muted-foreground text-center">
          © Made with love by Team{" "}
          <span className="text-primary font-medium">CodedThemes</span>
        </p>
      </div> */}

      {/* New Release Notification */}
      {/* <div className="fixed bottom-6 right-6 max-w-sm">
        <Card className="bg-success/10 border-success/20">
          <CardContent className="flex items-start gap-3 p-4">
            <div className="w-10 h-10 bg-success/20 rounded-lg flex items-center justify-center flex-shrink-0">
              <div className="w-6 h-6 bg-success/40 rounded" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-medium text-success-foreground">New Release 3.5.1</h4>
              <p className="text-sm text-success-foreground/80">Performance improvements</p>
            </div>
            <Button variant="ghost" size="icon" className="text-success-foreground/60 hover:text-success-foreground">
              ×
            </Button>
          </CardContent>
        </Card>
      </div> */}
    </div>
  );
};

export default Login;
