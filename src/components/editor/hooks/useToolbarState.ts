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
import { $isHeadingNode } from "@lexical/rich-text";
import { $isListNode, ListNode, type ListNodeTagType } from "@lexical/list";
import { $getNearestNodeOfType, mergeRegister } from "@lexical/utils";
import { $isLinkNode } from "@lexical/link";

export type BlockType = "paragraph" | "h1" | "h2" | "h3" | "h4";

export type EditorStyleState = {
  bold: boolean;
  italic: boolean;
  underline: boolean;
  code: boolean;
  isQuote: boolean;
  isUnorderedList: boolean;
  isOrderedList: boolean;
  isLink: boolean;
  isImage: boolean;
};

export function useToolbarState(editor: LexicalEditor) {
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  const [blockType, setBlockType] = useState<BlockType>("paragraph");
  const [formats, setFormats] = useState<EditorStyleState>({
    bold: false,
    italic: false,
    underline: false,
    code: false,
    isQuote: false,
    isUnorderedList: false,
    isOrderedList: false,
    isLink: false,
    isImage: false,
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
    if (["h1", "h2", "h3", "h4"].includes(tag)) {
      return tag as BlockType;
    }
  }
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
    code: selection.hasFormat("code"),
    isQuote: false,
    isUnorderedList: listType === "ul",
    isOrderedList: listType === "ol",
    isLink: $isLinkNode(anchorNode) || $isLinkNode(parent),
    isImage: false,
  };
}
