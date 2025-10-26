import { useState } from "react";
import { Control, Controller, FieldValues, Path, RegisterOptions } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";

interface FormInputProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  type: React.HTMLInputTypeAttribute;
  placeholder: string;
  label: string;
  rules: RegisterOptions<T, Path<T>>;
}

function FormInput<T extends FieldValues>({
  control,
  name,
  type,
  placeholder,
  label,
  rules ,
}: FormInputProps<T>) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({ field, fieldState: { error } }) => (
        <div className="w-full">
          <Label htmlFor={name} className="mb-1 block">
            {label}
            {rules?.required && <span className="text-red-500 ml-1">*</span>}
          </Label>

          <div className="relative">
            <Input
              {...field}
              id={name}
              // required={Boolean(rules?.required)}
              type={
                type === "password"
                  ? showPassword
                    ? "text"
                    : "password"
                  : type
              }
              placeholder={placeholder}
              onChange={(e)=>{
                 field.onChange(e.target.value)
              }}
              className={`h-12 pr-12 ${
                error ? "border-red-500 focus:ring-red-500" : ""
              }`}
            />

            {type === "password" && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-2 top-1/2 -translate-y-1/2 hover:bg-transparent"
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            )}
          </div>

          {error && (
            <p className="mt-1 text-xs text-red-500">
              {error?.message || "This field is required"}
            </p>
          )}
        </div>
      )}
    />
  );
}

export default FormInput;
