"use client";

import { BoldRules, HeadingRules } from "@platejs/basic-nodes";
import { BoldPlugin, H1Plugin } from "@platejs/basic-nodes/react";
import { createSlatePlugin, createTextSubstitutionInputRule, KEYS } from "platejs";

// Markdown rules belong to their feature plugins in plate-editor.tsx.
export const autoformatH1Plugin = H1Plugin.configure({ inputRules: [HeadingRules.markdown()] });
export const autoformatBoldPlugin = BoldPlugin.configure({ inputRules: [BoldRules.markdown()] });

const substitution = (
  patterns: Parameters<typeof createTextSubstitutionInputRule>[0]["patterns"],
) =>
  createTextSubstitutionInputRule({
    enabled: ({ editor }) =>
      !editor.api.some({ match: { type: [editor.getType(KEYS.codeBlock)] } }),
    patterns,
  });

export const autoformatPlugin = createSlatePlugin({
  key: "autoformatShortcuts",
  inputRules: [
    substitution([
      { format: "™", match: ["(tm)", "(TM)", "&trade;"] },
      { format: "®", match: ["(r)", "(R)", "&reg;"] },
      { format: "©", match: ["(c)", "(C)", "&copy;"] },
      { format: "§", match: "&sect;" },
    ]),
    substitution([
      { format: "→", match: "->" },
      { format: "←", match: "<-" },
      { format: "⇒", match: "=>" },
      { format: "⇐", match: ["<=", "≤="] },
    ]),
    substitution([
      { format: "≯", match: "!>" },
      { format: "≮", match: "!<" },
      { format: "≥", match: ">=" },
      { format: "≤", match: "<=" },
      { format: "≱", match: "!>=" },
      { format: "≰", match: "!<=" },
    ]),
    substitution([
      { format: "≠", match: "!=" },
      { format: "≡", match: "==" },
      { format: "≢", match: ["!==", "≠="] },
      { format: "≈", match: "~=" },
      { format: "≉", match: "!~=" },
    ]),
    substitution([
      { format: "½", match: "1/2" },
      { format: "⅓", match: "1/3" },
      { format: "¼", match: "1/4" },
      { format: "⅕", match: "1/5" },
      { format: "⅙", match: "1/6" },
      { format: "⅐", match: "1/7" },
      { format: "⅛", match: "1/8" },
      { format: "⅑", match: "1/9" },
      { format: "⅒", match: "1/10" },
      { format: "⅔", match: "2/3" },
      { format: "⅖", match: "2/5" },
      { format: "¾", match: "3/4" },
      { format: "⅗", match: "3/5" },
      { format: "⅜", match: "3/8" },
      { format: "⅘", match: "4/5" },
      { format: "⅚", match: "5/6" },
      { format: "⅝", match: "5/8" },
      { format: "⅞", match: "7/8" },
    ]),
    substitution([
      { format: "±", match: "+-" },
      { format: "‰", match: "%%" },
      { format: "‱", match: ["%%%", "‰%"] },
    ]),
    substitution([
      { format: "»", match: ">>" },
      { format: "«", match: "<<" },
    ]),
    substitution([
      { format: ["“", "”"], match: '"' },
      { format: ["‘", "’"], match: "'" },
    ]),
    substitution(
      "0123456789".split("").map((digit, index) => ({
        format: "₀₁₂₃₄₅₆₇₈₉"[index],
        match: `~${digit}`,
      })),
    ),
    substitution([
      { format: "₊", match: "~+" },
      { format: "₋", match: "~-" },
    ]),
    substitution(
      "0123456789".split("").map((digit, index) => ({
        format: "⁰¹²³⁴⁵⁶⁷⁸⁹"[index],
        match: `^${digit}`,
      })),
    ),
    substitution([
      { format: "°", match: "^o" },
      { format: "⁺", match: "^+" },
      { format: "⁻", match: "^-" },
    ]),
  ],
});
