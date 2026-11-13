"use client";
import { useComposedRef } from "@udecode/cn";
import debounce from "lodash/debounce.js";
import { CheckIcon, EraserIcon, PlusIcon } from "lucide-react";
import { type PlateEditor, useEditorRef, useEditorSelector } from "platejs/react";
import React from "react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ToolbarButton, ToolbarMenuGroup } from "@/features/editor/components/toolbar/toolbar";
import {
  DEFAULT_COLORS,
  DEFAULT_CUSTOM_COLORS,
  MAX_CUSTOM_COLORS,
} from "@/features/editor/data/color-palette";
import { cn } from "@/lib/utils";

const HEX_COLOR_RE = /^#[\da-f]{6}$/i;

function normalizeColor(color: string): string {
  return color.toLowerCase();
}

function isValidHexColor(color: string): boolean {
  return HEX_COLOR_RE.test(color);
}

function computeIsBrightColor(hex: string): boolean {
  if (!isValidHexColor(hex)) return false;

  const r = Number.parseInt(hex.slice(1, 3), 16);
  const g = Number.parseInt(hex.slice(3, 5), 16);
  const b = Number.parseInt(hex.slice(5, 7), 16);

  return (r * 299 + g * 587 + b * 114) / 1000 > 130;
}

function getEditorColorMarks(editor: PlateEditor, nodeType: string): string[] {
  const usedColors = new Set<string>();

  for (const [node] of editor.api.nodes({
    at: [],
    match: (currentNode) =>
      "text" in currentNode && typeof Reflect.get(currentNode, nodeType) === "string",
    mode: "all",
  })) {
    const nodeColor = Reflect.get(node, nodeType);
    if (typeof nodeColor === "string") usedColors.add(normalizeColor(nodeColor));
  }

  return Array.from(usedColors);
}

export function FontColorToolbarButton({
  children,
  nodeType,
  tooltip,
}: {
  children: React.ReactNode;
  nodeType: string;
  tooltip?: string;
} & Omit<React.ComponentProps<typeof DropdownMenu>, "children">) {
  const editor = useEditorRef();

  const selectionDefined = useEditorSelector((current) => !!current.selection, []);

  const color = useEditorSelector(
    (current) => {
      const mark = current.api.mark(nodeType);
      return typeof mark === "string" ? mark : undefined;
    },
    [nodeType],
  );

  const [selectedColor, setSelectedColor] = React.useState<string>();
  const [updatedColor, setUpdatedColor] = React.useState<string>();
  const [open, setOpen] = React.useState(false);
  const [colorsQueue, setColorsQueue] = React.useState<string[]>([]);

  const recordColorUsage = React.useCallback((nextColor: string) => {
    const normalized = normalizeColor(nextColor);

    if (!isValidHexColor(normalized)) return;

    setColorsQueue((prev) => {
      const filtered = prev
        .filter((c) => c !== normalized)
        .filter((c) => !DEFAULT_COLORS.some((dc) => normalizeColor(dc.value) === c));

      return [normalized, ...filtered].slice(0, 30);
    });
  }, []);

  const appendColors = React.useCallback((colors: string[]) => {
    setColorsQueue((prev) => {
      const normalized = colors.map(normalizeColor).filter(isValidHexColor);
      const existingSet = new Set(prev);
      const newColors = normalized
        .filter((c) => !existingSet.has(c))
        .filter((c) => !DEFAULT_COLORS.some((dc) => normalizeColor(dc.value) === c));

      return [...newColors, ...prev].slice(0, 30);
    });
  }, []);

  const onToggle = React.useCallback(
    (value = !open) => {
      setOpen(value);

      if (value) {
        const colorUsed = getEditorColorMarks(editor, nodeType);
        appendColors(colorUsed);

        if (selectedColor) {
          recordColorUsage(normalizeColor(selectedColor));
        }
      }
      if (!value) {
        setUpdatedColor(undefined);

        if (editor.selection) {
          setTimeout(() => {
            editor.tf.focus();
          }, 100);
        }
      }
    },
    [open, editor, nodeType, appendColors, selectedColor, recordColorUsage],
  );

  const updateColor = React.useCallback(
    (value: string) => {
      if (editor.selection) {
        setSelectedColor(value);
        setUpdatedColor(value);

        editor.tf.select(editor.selection);
        editor.tf.addMarks({ [nodeType]: value });
      }
    },
    [editor, nodeType],
  );

  const updateColorAndClose = React.useCallback(
    (value: string) => {
      updateColor(value);
      onToggle();
    },
    [onToggle, updateColor],
  );

  const clearColor = React.useCallback(() => {
    if (editor.selection) {
      editor.tf.select(editor.selection);
      editor.tf.removeMarks(nodeType);
      onToggle();
    }
  }, [editor, onToggle, nodeType]);

  React.useEffect(() => {
    if (selectionDefined) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- Preserve the mark color while menu focus clears editor selection.
      setSelectedColor(color);
    }
  }, [color, selectionDefined]);

  return (
    <DropdownMenu modal onOpenChange={onToggle} open={open}>
      <DropdownMenuTrigger
        render={
          <ToolbarButton pressed={open} tooltip={tooltip}>
            {children}
          </ToolbarButton>
        }
      />

      <DropdownMenuContent align="start" className="w-auto! min-w-60">
        <ColorPicker
          clearColor={clearColor}
          color={selectedColor || color}
          colors={DEFAULT_COLORS}
          colorsQueue={colorsQueue}
          customColors={DEFAULT_CUSTOM_COLORS}
          recordColorUsage={recordColorUsage}
          updateColor={updateColorAndClose}
          updateCustomColor={updateColor}
          updatedColor={updatedColor}
        />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function PureColorPicker({
  className,
  clearColor,
  color,
  colors,
  colorsQueue,
  customColors,
  recordColorUsage,
  updateColor,
  updateCustomColor,
  updatedColor,
  ...props
}: React.ComponentProps<"div"> & {
  colors: TColor[];
  colorsQueue: string[];
  customColors: TColor[];
  clearColor: () => void;
  recordColorUsage: (color: string) => void;
  updateColor: (color: string) => void;
  updateCustomColor: (color: string) => void;
  color?: string;
  updatedColor?: string;
}) {
  return (
    <div className={cn("flex flex-col", className)} {...props}>
      <ToolbarMenuGroup label="Custom Colors">
        <ColorCustom
          className="px-2"
          color={color}
          colors={colors}
          colorsQueue={colorsQueue}
          customColors={customColors}
          recordColorUsage={recordColorUsage}
          updateColor={updateColor}
          updateCustomColor={updateCustomColor}
          updatedColor={updatedColor}
        />
      </ToolbarMenuGroup>
      <ToolbarMenuGroup label="Default Colors">
        <ColorDropdownMenuItems
          className="px-2"
          color={color}
          colors={colors}
          updateColor={updateColor}
        />
      </ToolbarMenuGroup>
      {color && (
        <ToolbarMenuGroup>
          <DropdownMenuItem onClick={clearColor}>
            <EraserIcon />
            <span>Clear</span>
          </DropdownMenuItem>
        </ToolbarMenuGroup>
      )}
    </div>
  );
}

const ColorPicker = React.memo(
  PureColorPicker,
  (prev, next) =>
    prev.color === next.color &&
    prev.colors === next.colors &&
    prev.colorsQueue === next.colorsQueue &&
    prev.customColors === next.customColors &&
    prev.updatedColor === next.updatedColor,
);

function ColorCustom({
  className,
  color,
  colors,
  colorsQueue,
  customColors,
  recordColorUsage,
  updateColor,
  updateCustomColor,
  updatedColor,
  ...props
}: {
  colors: TColor[];
  colorsQueue: string[];
  customColors: TColor[];
  recordColorUsage: (color: string) => void;
  updateColor: (color: string) => void;
  updateCustomColor: (color: string) => void;
  color?: string;
  updatedColor?: string;
} & React.ComponentPropsWithoutRef<"div">) {
  const [value, setValue] = React.useState<string>(color || "#000000");

  const fullCustomColors = React.useMemo(
    () =>
      colorsQueue
        .filter((c) => normalizeColor(c) !== normalizeColor(updatedColor || ""))
        .filter((c) => !DEFAULT_COLORS.some((dc) => normalizeColor(dc.value) === normalizeColor(c)))
        .filter(
          (c) =>
            !DEFAULT_CUSTOM_COLORS.some((dc) => normalizeColor(dc.value) === normalizeColor(c)),
        )
        .map((c) => ({
          isBrightColor: computeIsBrightColor(c),
          name: c,
          value: c,
        }))
        .slice(0, MAX_CUSTOM_COLORS - customColors.length - (updatedColor ? 1 : 0)),
    [colorsQueue, customColors, updatedColor],
  );

  const isColorInCollections = React.useCallback(
    (targetColor: string) =>
      colors.some((c) => normalizeColor(c.value) === normalizeColor(targetColor)) ||
      customColors.some((c) => normalizeColor(c.value) === normalizeColor(targetColor)) ||
      fullCustomColors.some((c) => normalizeColor(c.value) === normalizeColor(targetColor)),
    [colors, customColors, fullCustomColors],
  );

  const customColor = React.useMemo(() => {
    if (!updatedColor || isColorInCollections(updatedColor)) {
      return null;
    }

    return updatedColor;
  }, [isColorInCollections, updatedColor]);

  const computedColors = React.useMemo(
    () =>
      customColor
        ? [
            ...customColors,
            {
              isBrightColor: computeIsBrightColor(customColor),
              name: customColor,
              value: customColor,
            },
            ...fullCustomColors,
          ]
        : [...customColors, ...fullCustomColors],
    [customColor, fullCustomColors, customColors],
  );

  const updateCustomColorDebounced = React.useMemo(
    () => debounce((nextValue: string) => updateCustomColor(nextValue), 100),
    [updateCustomColor],
  );

  React.useEffect(
    () => () => {
      updateCustomColorDebounced.cancel();
    },
    [updateCustomColorDebounced],
  );

  return (
    <div className={cn("flex flex-col gap-4", className)} {...props}>
      <ColorDropdownMenuItems
        color={color}
        colors={computedColors}
        updateColor={(c) => {
          updateColor(c);
          recordColorUsage(normalizeColor(c));
        }}
      >
        <ColorInput
          className="col-start-10"
          onChange={(e) => {
            setValue(e.target.value);
            updateCustomColorDebounced(e.target.value);
          }}
          value={value}
        >
          <DropdownMenuItem closeOnClick={false}>
            <span className="sr-only">Custom</span>
            <PlusIcon />
          </DropdownMenuItem>
        </ColorInput>
      </ColorDropdownMenuItems>
    </div>
  );
}

function ColorInput({
  children,
  className,
  value = "#000000",
  ...props
}: React.ComponentProps<"input"> & { className?: string }) {
  const inputRef = React.useRef<HTMLInputElement | null>(null);

  return (
    <div className={cn("flex flex-col items-center", className)}>
      {React.Children.map(children, (child) => {
        if (!React.isValidElement<{ onClick?: () => void }>(child)) return child;
        return React.cloneElement(child, { onClick: () => inputRef.current?.click() });
      })}
      <input
        {...props}
        className="size-0 overflow-hidden border-0 p-0"
        ref={useComposedRef(props.ref, inputRef)}
        type="color"
        value={value}
      />
    </div>
  );
}

type TColor = {
  isBrightColor: boolean;
  name: string;
  value: string;
};

function ColorDropdownMenuItem({
  isBrightColor: _isBrightColor,
  isSelected,
  name,
  updateColor,
  value,
  ...props
}: {
  isBrightColor: boolean;
  isSelected: boolean;
  value: string;
  updateColor: (color: string) => void;
  name?: string;
} & React.ComponentProps<typeof DropdownMenuItem>) {
  const content = (
    <DropdownMenuItem
      closeOnClick={false}
      onClick={() => {
        updateColor(value);
      }}
      {...props}
    >
      <span
        className="dynamic-background-color size-6 rounded-full border border-border"
        style={{ "--dynamic-background-color": value }}
        aria-hidden="true"
      />
      <span className="sr-only">{name ?? value}</span>
      {isSelected ? <CheckIcon /> : null}
    </DropdownMenuItem>
  );

  return name ? (
    <Tooltip>
      <TooltipTrigger render={content} />
      <TooltipContent className="mb-1">{name}</TooltipContent>
    </Tooltip>
  ) : (
    content
  );
}

export function ColorDropdownMenuItems({
  className,
  color,
  colors,
  updateColor,
  ...props
}: {
  colors: TColor[];
  updateColor: (color: string) => void;
  color?: string;
} & React.ComponentProps<"div">) {
  return (
    <div className={cn("grid grid-cols-10 place-items-center gap-x-1", className)} {...props}>
      <TooltipProvider>
        {colors.map(({ isBrightColor, name, value }) => (
          <ColorDropdownMenuItem
            name={name}
            key={name ?? value}
            value={value}
            isBrightColor={isBrightColor}
            isSelected={!!color && normalizeColor(color) === normalizeColor(value)}
            updateColor={updateColor}
          />
        ))}
        {props.children}
      </TooltipProvider>
    </div>
  );
}
