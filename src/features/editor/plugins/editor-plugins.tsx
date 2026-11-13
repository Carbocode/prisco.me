import emojiMartData from "@emoji-mart/data";
import {
  BlockquoteRules,
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
import {
  BlockquotePlugin,
  CodePlugin,
  H2Plugin,
  H3Plugin,
  H4Plugin,
  HighlightPlugin,
  HorizontalRulePlugin,
  ItalicPlugin,
  KbdPlugin,
  StrikethroughPlugin,
  SubscriptPlugin,
  SuperscriptPlugin,
  UnderlinePlugin,
} from "@platejs/basic-nodes/react";
import {
  FontBackgroundColorPlugin,
  FontColorPlugin,
  LineHeightPlugin,
  TextAlignPlugin,
} from "@platejs/basic-styles/react";
import { CalloutPlugin } from "@platejs/callout/react";
import { CodeBlockRules } from "@platejs/code-block";
import { CodeBlockPlugin, CodeLinePlugin, CodeSyntaxPlugin } from "@platejs/code-block/react";
import { CodeDrawingPlugin } from "@platejs/code-drawing/react";
import { DatePlugin } from "@platejs/date/react";
import { DndPlugin } from "@platejs/dnd";
import { EmojiInputPlugin, EmojiPlugin } from "@platejs/emoji/react";
import { IndentPlugin } from "@platejs/indent/react";
import { ColumnItemPlugin, ColumnPlugin } from "@platejs/layout/react";
import { LinkRules } from "@platejs/link";
import { LinkPlugin } from "@platejs/link/react";
import { BulletedListRules, OrderedListRules, TaskListRules } from "@platejs/list";
import { ListPlugin } from "@platejs/list/react";
import { MathRules } from "@platejs/math";
import { EquationPlugin, InlineEquationPlugin } from "@platejs/math/react";
import { MentionInputPlugin, MentionPlugin } from "@platejs/mention/react";
import { BlockSelectionPlugin } from "@platejs/selection/react";
import { SlashInputPlugin, SlashPlugin } from "@platejs/slash-command/react";
import {
  TableCellHeaderPlugin,
  TableCellPlugin,
  TablePlugin,
  TableRowPlugin,
} from "@platejs/table/react";
import { TocPlugin } from "@platejs/toc/react";
import { TogglePlugin } from "@platejs/toggle/react";
import { all, createLowlight } from "lowlight";
import { ExitBreakPlugin, KEYS, TrailingBlockPlugin } from "platejs";
import { BlockPlaceholderPlugin, ParagraphPlugin, createPlatePlugin } from "platejs/react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

import {
  autoformatBoldPlugin,
  autoformatH1Plugin,
  autoformatPlugin,
} from "@/features/editor/autoformat-plugin";
import { BlockDraggable } from "@/features/editor/components/block-draggable";
import {
  ParagraphElement,
  HeadingElement,
  BlockquoteElement,
  HorizontalRuleElement,
  TableElement,
  TableRowElement,
  TableCellElement,
  TableHeaderElement,
  TocElement,
} from "@/features/editor/components/nodes/basic-elements";
import { CalloutElement } from "@/features/editor/components/nodes/callout-node";
import {
  CodeBlockElement,
  CodeLineElement,
  CodeSyntaxLeaf,
} from "@/features/editor/components/nodes/code-block-node";
import { CodeDrawingElement } from "@/features/editor/components/nodes/code-drawing-node";
import { ColumnElement, ColumnGroupElement } from "@/features/editor/components/nodes/column-node";
import { DateElement } from "@/features/editor/components/nodes/date-node";
import { EmojiInputElement } from "@/features/editor/components/nodes/emoji-node";
import {
  EquationElement,
  InlineEquationElement,
} from "@/features/editor/components/nodes/equation-node";
import { LinkElement } from "@/features/editor/components/nodes/link-node";
import { MediaEmbedElement } from "@/features/editor/components/nodes/media-embed-node";
import { MediaImageElement } from "@/features/editor/components/nodes/media-image-node";
import {
  MentionElement,
  MentionInputElement,
} from "@/features/editor/components/nodes/mention-node";
import { SlashInputElement } from "@/features/editor/components/nodes/slash-node";
import { ToggleElement } from "@/features/editor/components/nodes/toggle-node";
import { FloatingToolbar } from "@/features/editor/components/toolbar/floating-toolbar";
import { FloatingToolbarButtons } from "@/features/editor/components/toolbar/floating-toolbar-buttons";
import { LinkFloatingToolbar } from "@/features/editor/components/toolbar/link-toolbar";

const MediaImagePlugin = createPlatePlugin({
  key: "mediaImage",
  node: { isElement: true, isVoid: true },
}).withComponent(MediaImageElement);

const MediaEmbedPlugin = createPlatePlugin({
  key: "mediaEmbed",
  node: { isElement: true, isVoid: true },
}).withComponent(MediaEmbedElement);

const lowlight = createLowlight(all);

export const editorPlugins = [
  ParagraphPlugin.withComponent(ParagraphElement),
  autoformatH1Plugin.withComponent((props) => <HeadingElement {...props} as="h2" />),
  H2Plugin.configure({ inputRules: [HeadingRules.markdown()] }).withComponent((props) => (
    <HeadingElement {...props} as="h3" />
  )),
  H3Plugin.configure({ inputRules: [HeadingRules.markdown()] }).withComponent((props) => (
    <HeadingElement {...props} as="h4" />
  )),
  H4Plugin.configure({ inputRules: [HeadingRules.markdown()] }).withComponent((props) => (
    <HeadingElement {...props} as="h5" />
  )),
  BlockquotePlugin.configure({ inputRules: [BlockquoteRules.markdown()] }).withComponent(
    BlockquoteElement,
  ),
  HorizontalRulePlugin.configure({ inputRules: [HorizontalRuleRules.markdown()] }).withComponent(
    HorizontalRuleElement,
  ),
  autoformatBoldPlugin,
  ItalicPlugin.configure({ inputRules: [ItalicRules.markdown()] }),
  StrikethroughPlugin.configure({ inputRules: [StrikethroughRules.markdown()] }),
  UnderlinePlugin.configure({ inputRules: [UnderlineRules.markdown()] }),
  CodePlugin.configure({ inputRules: [CodeRules.markdown()] }),
  HighlightPlugin.configure({ inputRules: [HighlightRules.markdown()] }),
  SuperscriptPlugin.configure({ inputRules: [SuperscriptRules.markdown()] }),
  SubscriptPlugin.configure({ inputRules: [SubscriptRules.markdown()] }),
  KbdPlugin,
  FontColorPlugin,
  FontBackgroundColorPlugin,
  LineHeightPlugin.configure({
    inject: {
      nodeProps: {
        defaultNodeValue: 1.5,
        validNodeValues: [1, 1.2, 1.5, 2, 3],
      },
      targetPlugins: [KEYS.p, KEYS.h1, KEYS.h2, KEYS.h3, KEYS.h4],
    },
  }),
  TextAlignPlugin,
  IndentPlugin,
  // Disable the plugin's built-in marker rendering — ParagraphElement draws the
  // markers/checkbox itself (kept in sync with the public renderer).
  ListPlugin.configure({
    inputRules: [
      BulletedListRules.markdown({ variant: "-" }),
      OrderedListRules.markdown({ variant: "." }),
      TaskListRules.markdown({ checked: false }),
      TaskListRules.markdown({ checked: true }),
    ],
    render: { belowNodes: () => undefined },
  }),
  CodeBlockPlugin.configure({
    inputRules: [CodeBlockRules.markdown({ on: "match" })],
    node: { component: CodeBlockElement },
    options: { lowlight },
  }),
  CodeLinePlugin.withComponent(CodeLineElement),
  CodeSyntaxPlugin.withComponent(CodeSyntaxLeaf),
  CalloutPlugin.withComponent(CalloutElement),
  CodeDrawingPlugin.withComponent(CodeDrawingElement),
  DatePlugin.withComponent(DateElement),
  EquationPlugin.configure({
    inputRules: [MathRules.markdown({ on: "break", variant: "$$" })],
  }).withComponent(EquationElement),
  InlineEquationPlugin.configure({
    inputRules: [MathRules.markdown({ variant: "$" })],
  }).withComponent(InlineEquationElement),
  ColumnPlugin.withComponent(ColumnGroupElement),
  ColumnItemPlugin.withComponent(ColumnElement),
  MentionPlugin.configure({ options: { triggerPreviousCharPattern: /^$|^[\s"']$/ } }).withComponent(
    MentionElement,
  ),
  MentionInputPlugin.withComponent(MentionInputElement),
  BlockSelectionPlugin,
  LinkPlugin.configure({
    inputRules: [
      LinkRules.markdown(),
      LinkRules.autolink({ variant: "paste" }),
      LinkRules.autolink({ variant: "space" }),
      LinkRules.autolink({ variant: "break" }),
    ],
    render: {
      node: LinkElement,
      afterEditable: () => <LinkFloatingToolbar />,
    },
  }),
  TablePlugin.withComponent(TableElement),
  TableRowPlugin.withComponent(TableRowElement),
  TableCellPlugin.withComponent(TableCellElement),
  TableCellHeaderPlugin.withComponent(TableHeaderElement),
  TocPlugin.configure({ options: { topOffset: 96 } }).withComponent(TocElement),
  MediaImagePlugin,
  MediaEmbedPlugin,
  TogglePlugin.withComponent(ToggleElement),
  DndPlugin.configure({
    options: { enableScroller: true },
    render: {
      aboveNodes: BlockDraggable,
      aboveSlate: ({ children }) => <DndProvider backend={HTML5Backend}>{children}</DndProvider>,
    },
  }),
  // Slash command "/"
  SlashPlugin,
  SlashInputPlugin.withComponent(SlashInputElement),
  // Emoji combobox ":"
  // oxlint-disable-next-line typescript/no-unsafe-type-assertion -- emoji-mart data shape.
  EmojiPlugin.configure({ options: { data: emojiMartData as never } }),
  EmojiInputPlugin.withComponent(EmojiInputElement),
  // Editing niceties
  autoformatPlugin,
  ExitBreakPlugin,
  TrailingBlockPlugin.configure({ options: { type: KEYS.p } }),
  BlockPlaceholderPlugin.configure({
    options: {
      className:
        "before:absolute before:cursor-text before:text-muted-foreground/60 before:content-[attr(placeholder)]",
      placeholders: {
        [KEYS.p]: 'Scrivi qualcosa, oppure premi "/" per i comandi…',
      },
      query: ({ path }) => path.length === 1,
    },
  }),
  // Floating selection toolbar
  createPlatePlugin({
    key: "floating-toolbar",
    render: {
      afterEditable: () => (
        <FloatingToolbar>
          <FloatingToolbarButtons />
        </FloatingToolbar>
      ),
    },
  }),
];
