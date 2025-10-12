import {
  LexicalComposer,
  type InitialConfigType,
} from "@lexical/react/LexicalComposer";
import { useImperativeHandle, type Ref } from "react";
import { ThemeProvider } from "@mui/material";
import { theme, MuiEditorTheme } from "@/components/editor/theme";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";

import {
  ToolbarPlugin,
  CodeHighlightShikiPlugin,
  ImagePlugin,
  DragDropPastePlugin,
  LinkPreviewPlugin,
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
import { $generateHtmlFromNodes } from "@lexical/html";
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

export type EditorHandle = {
  export: () => string;
};

export default function Editor({ ref }: { ref?: Ref<EditorHandle> }) {
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
        <LinkPreviewPlugin />
        <EditorHandleBridge ref={ref} />
      </LexicalComposer>
    </ThemeProvider>
  );
}

function EditorHandleBridge({ ref }: { ref?: Ref<EditorHandle> }) {
  const [editor] = useLexicalComposerContext();

  useImperativeHandle(ref, (): EditorHandle => {
    return {
      export: () => {
        let html = "";
        editor.read(() => {
          html = $generateHtmlFromNodes(editor, null);
        });

        return html;
      },
    };
  }, []);

  return null;
}
