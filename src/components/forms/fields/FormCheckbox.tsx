import { useState } from "react";
import {
  Control,
  Controller,
  FieldValues,
  Path,
  RegisterOptions,
} from "react-hook-form";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
interface FormInputProps<T extends FieldValues> {
  props?: FieldValues;
  control: Control<T>;
  name: Path<T>;
  label: string;
  rules?: RegisterOptions<T, Path<T>>;
}
function FormCheckbox<T extends FieldValues>({
  props,
  control,
  name,
  label,
  rules,
}: FormInputProps<T>) {
  return (
    <Controller
      {...props}
      control={control}
      name={name}
      rules={rules}
      render={({ field, fieldState: { error } }) => (
        <span>
          <div className="flex items-center space-x-2">
            <Checkbox
              {...field}
              id="remember"
              checked={field.value}
              onCheckedChange={field.onChange}
            />
            <Label htmlFor="remember" className="text-sm text-muted-foreground">
              {label}
            </Label>
          </div>
          <span className="mt-1 text-xs text-red-500">{error?.message || ""}</span>
        </span>
      )}
    />
  );
}

export default FormCheckbox;
