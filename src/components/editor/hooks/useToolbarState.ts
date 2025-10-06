import {
  $getSelection,
  $isRangeSelection,
  CAN_REDO_COMMAND,
  CAN_UNDO_COMMAND,
  type LexicalEditor,
  type LexicalNode,
  type RangeSelection,
} from "lexical";
import { useEffect, useState } from "react";
import { $isHeadingNode, $isQuoteNode } from "@lexical/rich-text";
import { $isListNode, ListNode, type ListNodeTagType } from "@lexical/list";
import { $isCodeNode } from "@lexical/code";
import { $getNearestNodeOfType, mergeRegister } from "@lexical/utils";
import { $isLinkNode } from "@lexical/link";

export type BlockType = "paragraph" | "h1" | "h2" | "h3" | "code" | "quote";

export type EditorStyleState = {
  bold: boolean;
  italic: boolean;
  underline: boolean;
  strikethrough: boolean;
  code: boolean;
  isUnorderedList: boolean;
  isOrderedList: boolean;
  isLink: boolean;
};

export function useToolbarState(editor: LexicalEditor) {
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  const [blockType, setBlockType] = useState<BlockType>("paragraph");
  const [formats, setFormats] = useState<EditorStyleState>({
    bold: false,
    italic: false,
    underline: false,
    strikethrough: false,
    code: false,
    isUnorderedList: false,
    isOrderedList: false,
    isLink: false,
  });

  useEffect(
    mergeRegister(
      editor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          const selection = $getSelection();
          if ($isRangeSelection(selection)) {
            setFormats(getSelectionFormats(selection));
            setBlockType(
              getBlockType(
                selection.anchor.getNode().getTopLevelElementOrThrow()
              )
            );
          }
        });
      }),
      editor.registerCommand<boolean>(
        CAN_UNDO_COMMAND,
        (payload) => {
          setCanUndo(payload);
          return false;
        },
        1
      ),
      editor.registerCommand<boolean>(
        CAN_REDO_COMMAND,
        (payload) => {
          setCanRedo(payload);
          return false;
        },
        1
      )
    )
  );

  return { blockType, formats, canUndo, canRedo };
}

function getBlockType(topNode: LexicalNode): BlockType {
  if ($isHeadingNode(topNode)) {
    const tag = topNode.getTag();
    if (["h1", "h2", "h3"].includes(tag)) {
      return tag as BlockType;
    }
  }
  if ($isQuoteNode(topNode)) return "quote";
  if ($isCodeNode(topNode)) return "code";
  return "paragraph";
}

function getSelectionFormats(selection: RangeSelection) {
  const anchorNode = selection.anchor.getNode();
  const parent = anchorNode.getParent();
  let topNode = anchorNode.getTopLevelElementOrThrow();

  let listType: ListNodeTagType | undefined;
  if ($isListNode(topNode)) {
    const parentList = $getNearestNodeOfType(anchorNode, ListNode);
    listType = (parentList ?? topNode).getTag();
  }

  return {
    bold: selection.hasFormat("bold"),
    italic: selection.hasFormat("italic"),
    underline: selection.hasFormat("underline"),
    strikethrough: selection.hasFormat("strikethrough"),
    code: selection.hasFormat("code"),
    isUnorderedList: listType === "ul",
    isOrderedList: listType === "ol",
    isLink: $isLinkNode(anchorNode) || $isLinkNode(parent),
  };
}
