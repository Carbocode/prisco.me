import { isOrderedList } from "@platejs/list";
import { useTocElement, useTocElementState } from "@platejs/toc/react";
import { type TElement } from "platejs";
import { PlateElement, useEditorRef, useNodePath, type PlateElementProps } from "platejs/react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

export function ParagraphElement(props: PlateElementProps) {
  const element = props.element as TElement & {
    checked?: boolean;
    indent?: number;
    listStyleType?: string;
    textAlign?: string;
  };
  const editor = useEditorRef();
  const path = useNodePath(element);
  if (element.listStyleType === "todo") {
    return (
      <PlateElement
        {...props}
        as="div"
        className="cms-plate-list-item cms-plate-list-item--todo dynamic-margin-left"
        style={{ "--dynamic-margin-left": `${Math.max(0, (element.indent ?? 1) - 1) * 1.5}rem` }}
      >
        <span contentEditable={false} className="cms-plate-checkbox">
          <Checkbox
            checked={element.checked === true}
            aria-label="Completa attività"
            onCheckedChange={(checked) => {
              if (path) editor.tf.setNodes({ checked }, { at: path });
            }}
          />
        </span>
        <span>{props.children}</span>
      </PlateElement>
    );
  }
  if (element.listStyleType) {
    const ordered = isOrderedList(element);
    let listNumber = 1;
    if (ordered && path?.length === 1) {
      for (let index = path[0] - 1; index >= 0; index -= 1) {
        const previous = editor.children[index];
        if (!isOrderedList(previous) || previous.indent !== element.indent) break;
        listNumber += 1;
      }
    }
    return (
      <PlateElement
        {...props}
        as="div"
        className={cn(
          cn("cms-plate-list-item", ordered && ""),
          "dynamic-margin-left dynamic-text-align",
        )}
        data-list-type={element.listStyleType}
        style={{
          "--dynamic-margin-left": `${Math.max(0, (element.indent ?? 1) - 1) * 1.5}rem`,
          "--dynamic-text-align": textAlignment(element.textAlign),
        }}
      >
        <span contentEditable={false} className="cms-plate-list-marker">
          {ordered ? `${listNumber}.` : "•"}
        </span>
        <span>{props.children}</span>
      </PlateElement>
    );
  }
  return (
    <PlateElement
      {...props}
      as="p"
      style={{ "--dynamic-text-align": textAlignment(element.textAlign) }}
      className="dynamic-text-align"
    />
  );
}

export function HeadingElement({
  as,
  ...props
}: PlateElementProps & { as: "h2" | "h3" | "h4" | "h5" }) {
  const element = props.element as TElement & { textAlign?: string };
  return (
    <PlateElement
      {...props}
      as={as}
      style={{ "--dynamic-text-align": textAlignment(element.textAlign) }}
      className="dynamic-text-align"
    />
  );
}

export function BlockquoteElement(props: PlateElementProps) {
  return <PlateElement {...props} as="blockquote" />;
}

export function HorizontalRuleElement(props: PlateElementProps) {
  return (
    <PlateElement {...props} as="div" className="cms-editor__separator">
      <div contentEditable={false}>
        <Separator className="h-px w-full" />
      </div>
      {props.children}
    </PlateElement>
  );
}

export function TableElement(props: PlateElementProps) {
  return (
    <div className="cms-content-table">
      <PlateElement {...props} as="table">
        <tbody>{props.children}</tbody>
      </PlateElement>
    </div>
  );
}

export function TableRowElement(props: PlateElementProps) {
  return <PlateElement {...props} as="tr" />;
}

export function TableHeaderElement(props: PlateElementProps) {
  return <PlateElement {...props} as="th" />;
}

export function TableCellElement(props: PlateElementProps) {
  return <PlateElement {...props} as="td" />;
}

export function TocElement(props: PlateElementProps) {
  const state = useTocElementState();
  const { props: tocProps } = useTocElement(state);
  return (
    <PlateElement {...props} as="nav" className="cms-content-toc">
      <div contentEditable={false}>
        <strong>In questa pagina</strong>
        {state.headingList.length ? (
          <ul>
            {state.headingList.map((heading) => (
              <li key={heading.id} data-depth={heading.depth}>
                <Button
                  type="button"
                  variant="link"
                  onClick={(event) => tocProps.onClick(event, heading, "smooth")}
                >
                  {heading.title}
                </Button>
              </li>
            ))}
          </ul>
        ) : (
          <p>Aggiungi dei titoli per costruire l’indice.</p>
        )}
      </div>
      {props.children}
    </PlateElement>
  );
}

function textAlignment(value: unknown): "left" | "center" | "right" | "justify" | undefined {
  if (value === "left") return "left";
  if (value === "center") return "center";
  if (value === "right") return "right";
  if (value === "justify") return "justify";
  return undefined;
}
