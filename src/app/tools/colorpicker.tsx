"use client";

import { forwardRef, useMemo } from "react";
import { HexColorPicker } from "react-colorful";
import { useForwardedRef } from "@/lib/use-forwarded-ref";
import type { ButtonProps } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface ColorPickerProps {
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
}

const ColorPicker = forwardRef<
  HTMLInputElement,
  Omit<ButtonProps, "value" | "onChange" | "onBlur"> & ColorPickerProps
>(({ value, onChange, onBlur, className }, forwardedRef) => {
  const ref = useForwardedRef(forwardedRef);

  const parsedValue = useMemo(() => {
    return value || "#FFFFFF";
  }, [value]);

  return (
    <div onBlur={onBlur} className={className}>
      <HexColorPicker color={parsedValue} onChange={onChange} />
      <Input
        className="mt-4 max-w-[30rem] "
        maxLength={7}
        onChange={(e) => {
          onChange(e?.currentTarget?.value);
        }}
        ref={ref}
        value={parsedValue}
      />
    </div>
  );
});
ColorPicker.displayName = "ColorPicker";

export const ColorPickerUse = () => {
  const [color, setColor] = useState("#0f0f0f");

  return (
    <Card className="mr-[10vw] sm:mr-[30vw] md:mr-[40vw] ml-8">
      <CardHeader>
        <CardTitle className="mb-4 truncate">
          Color Picker (powered by{" "}
          <a
            href="https://github.com/nightspite/shadcn-color-picker"
            className="text-blue-400"
          >
            https://github.com/nightspite/shadcn-color-picker
          </a>
          )
        </CardTitle>
        <Separator />
      </CardHeader>
      <CardContent>
        <ColorPicker
          onChange={(v) => {
            setColor(v);
          }}
          value={color}
        />{" "}
      </CardContent>
    </Card>
  );
};
