"use client";

import { formatCodeBlock, isLangSupported } from "@platejs/code-block";
import { BracesIcon, Check, CheckIcon, CopyIcon } from "lucide-react";
import { NodeApi, type TCodeBlockElement, type TCodeSyntaxLeaf } from "platejs";
import {
  PlateElement,
  type PlateElementProps,
  PlateLeaf,
  type PlateLeafProps,
  useEditorRef,
  useElement,
  useReadOnly,
} from "platejs/react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

type CodeBlockElementProps = PlateElementProps<TCodeBlockElement> & {
  showLanguageLabel?: boolean;
};

const codeBlockLanguages: { label: string; value: string }[] = [
  { label: "Auto", value: "auto" },
  { label: "Plain Text", value: "plaintext" },
  { label: "Bash", value: "bash" },
  { label: "C", value: "c" },
  { label: "C#", value: "csharp" },
  { label: "C++", value: "cpp" },
  { label: "CSS", value: "css" },
  { label: "Dart", value: "dart" },
  { label: "Docker", value: "dockerfile" },
  { label: "Go", value: "go" },
  { label: "GraphQL", value: "graphql" },
  { label: "Haskell", value: "haskell" },
  { label: "HTML", value: "html" },
  { label: "Java", value: "java" },
  { label: "JavaScript", value: "javascript" },
  { label: "JSON", value: "json" },
  { label: "Kotlin", value: "kotlin" },
  { label: "LaTeX", value: "latex" },
  { label: "Lua", value: "lua" },
  { label: "Markdown", value: "markdown" },
  { label: "Objective-C", value: "objectivec" },
  { label: "OCaml", value: "ocaml" },
  { label: "PHP", value: "php" },
  { label: "PowerShell", value: "powershell" },
  { label: "Python", value: "python" },
  { label: "R", value: "r" },
  { label: "Ruby", value: "ruby" },
  { label: "Rust", value: "rust" },
  { label: "Scala", value: "scala" },
  { label: "SCSS", value: "scss" },
  { label: "Shell", value: "shell" },
  { label: "SQL", value: "sql" },
  { label: "Swift", value: "swift" },
  { label: "TOML", value: "toml" },
  { label: "TypeScript", value: "typescript" },
  { label: "VB.Net", value: "vbnet" },
  { label: "XML", value: "xml" },
  { label: "YAML", value: "yaml" },
];

function getCodeBlockLanguageLabel(lang?: string | null) {
  const value = lang?.trim();
  if (!value) return null;
  return codeBlockLanguages.find((language) => language.value === value)?.label ?? value;
}

export function CodeBlockElement({ showLanguageLabel = true, ...props }: CodeBlockElementProps) {
  const { editor, element } = props;

  return (
    <PlateElement
      className="py-1 **:[.hljs-addition]:bg-syntax-addition-bg **:[.hljs-addition]:text-syntax-addition dark:**:[.hljs-addition]:bg-syntax-addition-dark-bg dark:**:[.hljs-addition]:text-syntax-addition-dark **:[.hljs-attr,.hljs-attribute,.hljs-literal,.hljs-meta,.hljs-number,.hljs-operator,.hljs-selector-attr,.hljs-selector-class,.hljs-selector-id,.hljs-variable]:text-syntax-literal dark:**:[.hljs-attr,.hljs-attribute,.hljs-literal,.hljs-meta,.hljs-number,.hljs-operator,.hljs-selector-attr,.hljs-selector-class,.hljs-selector-id,.hljs-variable]:text-syntax-literal-dark **:[.hljs-built_in,.hljs-symbol]:text-syntax-symbol dark:**:[.hljs-built_in,.hljs-symbol]:text-syntax-symbol-dark **:[.hljs-bullet]:text-syntax-bullet **:[.hljs-comment,.hljs-code,.hljs-formula]:text-syntax-comment dark:**:[.hljs-comment,.hljs-code,.hljs-formula]:text-syntax-comment **:[.hljs-deletion]:bg-syntax-deletion-bg **:[.hljs-deletion]:text-syntax-deletion dark:**:[.hljs-deletion]:bg-syntax-deletion-dark-bg dark:**:[.hljs-deletion]:text-syntax-deletion-dark **:[.hljs-emphasis]:italic **:[.hljs-keyword,.hljs-doctag,.hljs-template-tag,.hljs-template-variable,.hljs-type,.hljs-variable.language]:text-syntax-keyword dark:**:[.hljs-keyword,.hljs-doctag,.hljs-template-tag,.hljs-template-variable,.hljs-type,.hljs-variable.language]:text-syntax-keyword-dark **:[.hljs-name,.hljs-quote,.hljs-selector-tag,.hljs-selector-pseudo]:text-syntax-addition dark:**:[.hljs-name,.hljs-quote,.hljs-selector-tag,.hljs-selector-pseudo]:text-syntax-name-dark **:[.hljs-regexp,.hljs-string,.hljs-meta_.hljs-string]:text-syntax-string dark:**:[.hljs-regexp,.hljs-string,.hljs-meta_.hljs-string]:text-syntax-string-dark **:[.hljs-section]:font-bold **:[.hljs-section]:text-syntax-literal dark:**:[.hljs-section]:text-syntax-section-dark **:[.hljs-strong]:font-bold **:[.hljs-title]:text-syntax-title dark:**:[.hljs-title]:text-syntax-title-dark"
      {...props}
    >
      <div className="overflow-hidden rounded-md bg-muted/50">
        <div
          className="flex select-none items-center justify-end gap-0.5 border-b border-border/50 px-2 py-1"
          contentEditable={false}
        >
          {isLangSupported(element.lang) && (
            <Button
              className="size-6"
              onClick={() => formatCodeBlock(editor, { element })}
              size="icon"
              title="Formatta il codice"
              variant="ghost"
            >
              <BracesIcon className="size-3.5! text-muted-foreground" />
            </Button>
          )}

          <CodeBlockCombobox showLanguageLabel={showLanguageLabel} />

          <CopyButton
            className="size-6"
            size="icon"
            value={() => NodeApi.string(element)}
            variant="ghost"
          />
        </div>
        <pre className="overflow-x-auto px-4 py-3 font-mono text-sm leading-normal tab-2 print:break-inside-avoid">
          <code>{props.children}</code>
        </pre>
      </div>
    </PlateElement>
  );
}

function CodeBlockCombobox({ showLanguageLabel }: { showLanguageLabel: boolean }) {
  const [open, setOpen] = React.useState(false);
  const readOnly = useReadOnly();
  const editor = useEditorRef();
  const element = useElement<TCodeBlockElement>();
  const value = element.lang || "plaintext";
  const [searchValue, setSearchValue] = React.useState("");

  const items = React.useMemo(
    () =>
      codeBlockLanguages.filter(
        (language) =>
          !searchValue || language.label.toLowerCase().includes(searchValue.toLowerCase()),
      ),
    [searchValue],
  );

  if (readOnly) {
    if (!showLanguageLabel) return null;
    return <CodeBlockLanguageLabel lang={element.lang} />;
  }

  return (
    <Popover
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) setSearchValue("");
      }}
    >
      <PopoverTrigger
        render={
          <Button
            aria-expanded={open}
            className="h-6 select-none justify-between"
            size="sm"
            variant="ghost"
          >
            {getCodeBlockLanguageLabel(value) ?? "Plain Text"}
          </Button>
        }
      />
      <PopoverContent className="w-50">
        <Command shouldFilter={false}>
          <CommandInput
            className="h-9"
            onValueChange={(next) => setSearchValue(next)}
            placeholder="Cerca linguaggio…"
            value={searchValue}
          />
          <CommandEmpty>Nessun linguaggio trovato.</CommandEmpty>

          <CommandList className="h-86 overflow-y-auto">
            <CommandGroup>
              {items.map((language) => (
                <CommandItem
                  className="cursor-pointer"
                  key={language.label}
                  onSelect={() => {
                    editor.tf.setNodes<TCodeBlockElement>(
                      { lang: language.value },
                      { at: element },
                    );
                    setOpen(false);
                  }}
                  value={language.value}
                >
                  <Check className={cn(value === language.value ? "opacity-100" : "opacity-0")} />
                  {language.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

function CodeBlockLanguageLabel({ lang }: { lang?: string | null }) {
  const label = getCodeBlockLanguageLabel(lang);
  if (!label) return null;

  return (
    <span className="flex h-6 select-none items-center px-2 text-muted-foreground text-xs">
      {label}
    </span>
  );
}

function CopyButton({
  value,
  ...props
}: { value: (() => string) | string } & Omit<React.ComponentProps<typeof Button>, "value">) {
  const [hasCopied, setHasCopied] = React.useState(false);

  const resetTimer = React.useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  React.useEffect(() => () => clearTimeout(resetTimer.current), []);

  return (
    <Button
      onClick={() => {
        void navigator.clipboard.writeText(typeof value === "function" ? value() : value);
        setHasCopied(true);
        clearTimeout(resetTimer.current);
        resetTimer.current = setTimeout(() => setHasCopied(false), 2000);
      }}
      {...props}
    >
      <span className="sr-only">Copia</span>
      {hasCopied ? <CheckIcon className="size-3!" /> : <CopyIcon className="size-3!" />}
    </Button>
  );
}

export function CodeLineElement(props: PlateElementProps) {
  return <PlateElement {...props} />;
}

export function CodeSyntaxLeaf(props: PlateLeafProps<TCodeSyntaxLeaf>) {
  const tokenClassName =
    typeof props.leaf.className === "string" ? props.leaf.className : undefined;
  return <PlateLeaf className={tokenClassName} {...props} />;
}
