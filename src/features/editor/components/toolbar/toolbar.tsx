"use client";

import { ChevronDown } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { DropdownMenuLabel, DropdownMenuRadioGroup } from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { Toggle } from "@/components/ui/toggle";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

export function Toolbar({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      role="toolbar"
      className={cn("relative flex select-none items-center", className)}
      {...props}
    />
  );
}

type ToolbarButtonProps = Omit<
  React.ComponentProps<typeof Button>,
  "size" | "value" | "variant"
> & {
  isDropdown?: boolean;
  pressed?: boolean;
  tooltip?: React.ReactNode;
  value?: string;
};

export function ToolbarButton({
  children,
  className,
  isDropdown,
  pressed,
  tooltip,
  ...props
}: ToolbarButtonProps) {
  const content = (
    <>
      {children}
      {isDropdown ? <ChevronDown data-icon="inline-end" /> : null}
    </>
  );

  const control =
    typeof pressed === "boolean" ? (
      <Toggle className={className} size="sm" pressed={pressed} {...props}>
        {content}
      </Toggle>
    ) : (
      <Button className={className} type="button" variant="ghost" size="sm" {...props}>
        {content}
      </Button>
    );

  if (!tooltip) return control;

  return (
    <Tooltip>
      <TooltipTrigger render={control} />
      <TooltipContent>{tooltip}</TooltipContent>
    </Tooltip>
  );
}

export function ToolbarGroup({ children, className }: React.ComponentProps<"div">) {
  return (
    <div className={cn("group/toolbar-group relative hidden has-[button]:flex", className)}>
      <div className="flex items-center">{children}</div>
      <div className="group-last/toolbar-group:hidden! mx-1.5 py-0.5">
        <Separator orientation="vertical" />
      </div>
    </div>
  );
}

export function ToolbarMenuGroup({
  children,
  label,
  ...props
}: React.ComponentProps<typeof DropdownMenuRadioGroup> & { label?: string }) {
  return (
    <DropdownMenuRadioGroup {...props}>
      {label ? <DropdownMenuLabel>{label}</DropdownMenuLabel> : null}
      {children}
    </DropdownMenuRadioGroup>
  );
}
