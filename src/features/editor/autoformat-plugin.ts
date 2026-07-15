"use client";

import {
  BlockquoteRules,
  BoldRules,
  CodeRules,
  HeadingRules,
  HighlightRules,
  HorizontalRuleRules,
  ItalicRules,
  StrikethroughRules,
  SubscriptRules,
  SuperscriptRules,
  UnderlineRules,
} from "@platejs/basic-nodes";
import { CodeBlockRules } from "@platejs/code-block";
import { BulletedListRules, OrderedListRules, TaskListRules } from "@platejs/list";
import { createPlatePlugin } from "platejs/react";

/**
 * Markdown-style autoformat: registers the v53 feature-owned input rules
 * (# → heading, - → list, ``` → code block, **bold**, etc.) on a single plugin.
 */
export const autoformatPlugin = createPlatePlugin({
  key: "markdownAutoformat",
  inputRules: [
    HeadingRules.markdown(),
    BlockquoteRules.markdown(),
    HorizontalRuleRules.markdown(),
    CodeBlockRules.markdown({ on: "match" }),
    BulletedListRules.markdown({}),
    OrderedListRules.markdown({}),
    TaskListRules.markdown({}),
    BoldRules.markdown(),
    ItalicRules.markdown(),
    UnderlineRules.markdown(),
    StrikethroughRules.markdown(),
    CodeRules.markdown(),
    HighlightRules.markdown(),
    SuperscriptRules.markdown(),
    SubscriptRules.markdown(),
  ],
});
