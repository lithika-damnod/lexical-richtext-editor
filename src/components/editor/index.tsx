import {
  LexicalComposer,
  type InitialConfigType,
} from "@lexical/react/LexicalComposer";
import { lazy, Suspense, useImperativeHandle, type Ref } from "react";
import { ThemeProvider } from "@mui/material";
import { theme, MuiEditorTheme } from "@/components/editor/theme";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";

// core nodes
import { ImageNode } from "./nodes";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { LinkNode } from "@lexical/link";
import { CodeHighlightNode, CodeNode } from "@lexical/code";
import { ListItemNode, ListNode } from "@lexical/list";

// helpers
import { TRANSFORMERS } from "@lexical/markdown";

// essential plugins
import { ToolbarPlugin } from "./plugins";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";

// lazy loaded plugins
const HistoryPlugin = lazy(() =>
  import("@lexical/react/LexicalHistoryPlugin").then((m) => ({
    default: m.HistoryPlugin,
  }))
);
const LinkPlugin = lazy(() =>
  import("@lexical/react/LexicalLinkPlugin").then((m) => ({
    default: m.LinkPlugin,
  }))
);
const ListPlugin = lazy(() =>
  import("@lexical/react/LexicalListPlugin").then((m) => ({
    default: m.ListPlugin,
  }))
);
const TabIndentationPlugin = lazy(() =>
  import("@lexical/react/LexicalTabIndentationPlugin").then((m) => ({
    default: m.TabIndentationPlugin,
  }))
);
const MarkdownShortcutPlugin = lazy(() =>
  import("@lexical/react/LexicalMarkdownShortcutPlugin").then((m) => ({
    default: m.MarkdownShortcutPlugin,
  }))
);

const CodeHighlightShikiPlugin = lazy(() =>
  import("./plugins/CodeHighlightShikiPlugin").then((m) => ({
    default: m.CodeHighlightShikiPlugin,
  }))
);
const ImagePlugin = lazy(() =>
  import("./plugins/ImagePlugin").then((m) => ({ default: m.ImagePlugin }))
);
const DragDropPastePlugin = lazy(() =>
  import("./plugins/DragDropPastePlugin").then((m) => ({
    default: m.DragDropPastePlugin,
  }))
);
const LinkPreviewPlugin = lazy(() =>
  import("./plugins/LinkPreviewPlugin").then((m) => ({
    default: m.LinkPreviewPlugin,
  }))
);

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
  export: () => Promise<string>;
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
        <Suspense fallback={null}>
          <HistoryPlugin />
          <TabIndentationPlugin />
          <LinkPlugin />
          <ListPlugin />
          <MarkdownShortcutPlugin transformers={TRANSFORMERS} />
          <CodeHighlightShikiPlugin />
          <ImagePlugin />
          <DragDropPastePlugin />
          <LinkPreviewPlugin />
        </Suspense>
        <EditorHandleBridge ref={ref} />
      </LexicalComposer>
    </ThemeProvider>
  );
}

function EditorHandleBridge({ ref }: { ref?: Ref<EditorHandle> }) {
  const [editor] = useLexicalComposerContext();

  useImperativeHandle(ref, (): EditorHandle => {
    return {
      export: async () => {
        const { $generateHtmlFromNodes } = await import("@lexical/html");

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
