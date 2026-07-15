"use client";

import { type TComboboxInputElement } from "platejs";
import type { PlateElementProps } from "platejs/react";
import { PlateElement } from "platejs/react";

import { useEditorActions } from "@/features/editor/editor-actions-context";
import { INSERT_GROUPS } from "@/features/editor/insert-items";

import {
  InlineCombobox,
  InlineComboboxContent,
  InlineComboboxEmpty,
  InlineComboboxGroup,
  InlineComboboxGroupLabel,
  InlineComboboxInput,
  InlineComboboxItem,
} from "./inline-combobox";

export function SlashInputElement(props: PlateElementProps<TComboboxInputElement>) {
  const { editor, element } = props;
  const { onMedia, onEmbed } = useEditorActions();

  return (
    <PlateElement {...props} as="span">
      <InlineCombobox element={element} trigger="/">
        <InlineComboboxInput />

        <InlineComboboxContent>
          <InlineComboboxEmpty>Nessun risultato</InlineComboboxEmpty>

          {INSERT_GROUPS.map(({ group, items }) => (
            <InlineComboboxGroup key={group}>
              <InlineComboboxGroupLabel>{group}</InlineComboboxGroupLabel>

              {items.map((item) => (
                <InlineComboboxItem
                  group={group}
                  key={item.label}
                  keywords={item.keywords}
                  label={item.label}
                  onClick={() => item.run({ editor, onMedia, onEmbed })}
                  value={item.label}
                >
                  <div className="mr-2 text-muted-foreground">{item.icon}</div>
                  {item.label}
                </InlineComboboxItem>
              ))}
            </InlineComboboxGroup>
          ))}
        </InlineComboboxContent>
      </InlineCombobox>

      {props.children}
    </PlateElement>
  );
}
