import {
  LexicalComposer,
  type InitialConfigType,
} from "@lexical/react/LexicalComposer";
import { ThemeProvider } from "@mui/material";
import { theme, MuiEditorTheme } from "@/components/editor/theme";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";

import {
  ToolbarPlugin,
  CodeHighlightShikiPlugin,
  ImagePlugin,
  DragDropPastePlugin,
} from "./plugins";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { LinkPlugin } from "@lexical/react/LexicalLinkPlugin";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import { TabIndentationPlugin } from "@lexical/react/LexicalTabIndentationPlugin";
import { MarkdownShortcutPlugin } from "@lexical/react/LexicalMarkdownShortcutPlugin";

import { ImageNode } from "./nodes";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { LinkNode } from "@lexical/link";
import { CodeHighlightNode, CodeNode } from "@lexical/code";
import { ListItemNode, ListNode } from "@lexical/list";
import { TRANSFORMERS } from "@lexical/markdown";

import "./theme.css";
import "./styles.css";

const editorConfig: InitialConfigType = {
  namespace: "editor",
  theme,
  nodes: [
    HeadingNode,
    LinkNode,
    CodeHighlightNode,
    CodeNode,
    QuoteNode,
    ListItemNode,
    ListNode,
    ImageNode,
  ],
  onError(error: Error) {
    console.error("[lexical-editor]", error);
  },
};

export default function Editor() {
  return (
    <ThemeProvider theme={MuiEditorTheme}>
      <LexicalComposer initialConfig={editorConfig}>
        <div className="editor-container">
          <ToolbarPlugin />
          <RichTextPlugin
            ErrorBoundary={LexicalErrorBoundary}
            contentEditable={<ContentEditable className="content-editable" />}
          />
        </div>
        <HistoryPlugin />
        <AutoFocusPlugin />
        <TabIndentationPlugin />
        <LinkPlugin />
        <ListPlugin />
        <MarkdownShortcutPlugin transformers={TRANSFORMERS} />
        <CodeHighlightShikiPlugin />
        <ImagePlugin />
        <DragDropPastePlugin />
      </LexicalComposer>
    </ThemeProvider>
  );
}
