import {
  $createParagraphNode,
  $getSelection,
  $isRangeSelection,
  FORMAT_TEXT_COMMAND,
  REDO_COMMAND,
  UNDO_COMMAND,
  type LexicalEditor,
} from "lexical";
import {
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
} from "@lexical/list";
import { $toggleLink } from "@lexical/link";
import { $setBlocksType } from "@lexical/selection";
import {
  $createHeadingNode,
  $createQuoteNode,
  type HeadingTagType,
} from "@lexical/rich-text";
import { $createCodeNode } from "@lexical/code";
import { $patchStyleText } from "@lexical/selection";
import { INSERT_IMAGE_COMMAND } from "../../plugins";
import type { TextColor } from "../../ui";

export function handleUndo(editor: LexicalEditor) {
  editor.dispatchCommand(UNDO_COMMAND, undefined);
}

export function handleRedo(editor: LexicalEditor) {
  editor.dispatchCommand(REDO_COMMAND, undefined);
}

export function setHeading(editor: LexicalEditor, level: HeadingTagType) {
  editor.update(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      $setBlocksType(selection, () => $createHeadingNode(level));
    }
  });
}

export function setParagraph(editor: LexicalEditor) {
  editor.update(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      $setBlocksType(selection, () => $createParagraphNode());
    }
  });
}

export function setCodeBlock(editor: LexicalEditor) {
  editor.update(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      $setBlocksType(selection, () => $createCodeNode());
    }
  });
}

export function setQuote(editor: LexicalEditor) {
  editor.update(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      $setBlocksType(selection, () => $createQuoteNode());
    }
  });
}

export function setTextColor(editor: LexicalEditor, color: TextColor) {
  editor.update(() => {
    const selection = $getSelection();
    if (selection) $patchStyleText(selection, { color: color });
  });
}

export function toggleBold(editor: LexicalEditor) {
  editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold");
}

export function toggleItalic(editor: LexicalEditor) {
  editor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic");
}

export function toggleUnderline(editor: LexicalEditor) {
  editor.dispatchCommand(FORMAT_TEXT_COMMAND, "underline");
}

export function toggleStrikethrough(editor: LexicalEditor) {
  editor.dispatchCommand(FORMAT_TEXT_COMMAND, "strikethrough");
}

export function toggleCode(editor: LexicalEditor) {
  editor.dispatchCommand(FORMAT_TEXT_COMMAND, "code");
}

export function toggleUnorderedList(editor: LexicalEditor) {
  editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
}
export function toggleOrderedList(editor: LexicalEditor) {
  editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined);
}

// TODO:
export function insertLink(editor: LexicalEditor) {
  editor.update(() => {
    const selection = $getSelection();
    if (selection) {
      $toggleLink("https://example.com");
    }
  });
}

export function insertImage(editor: LexicalEditor) {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = "image/*";
  input.multiple = false;

  input.onchange = (event: Event) => {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const src = e.target?.result as string;
      editor.dispatchCommand(INSERT_IMAGE_COMMAND, {
        src: src,
        alt: "",
      });
    };

    reader.readAsDataURL(file);
  };

  input.click();
}
