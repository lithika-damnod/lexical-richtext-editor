import type { LexicalEditor } from "lexical";
import {
  insertImage,
  insertLink,
  setCodeBlock,
  setHeading,
  setParagraph,
  toggleBold,
  toggleCode,
  toggleItalic,
  toggleOrderedList,
  toggleUnderline,
  toggleUnorderedList,
} from "./utils";
import type { BlockType, EditorStyleState } from "../../hooks";
import type { PopoverItemProps, ToolbarButtonProps } from "../../ui";
import { TextIcon } from "../../icons";

export function getBlockTypeOptions(
  editor: LexicalEditor,
  active: BlockType
): PopoverItemProps[] {
  return [
    {
      title: "Paragraph",
      active: active == "paragraph",
      icon: TextIcon,
      onClick: () => setParagraph(editor),
    },
    {
      title: "Heading 1",
      active: active == "h1",
      icon: TextIcon,
      onClick: () => setHeading(editor, "h1"),
    },
    {
      title: "Heading 2",
      active: active == "h2",
      icon: TextIcon,
      onClick: () => setHeading(editor, "h2"),
    },
    {
      title: "Heading 3",
      active: active == "h3",
      icon: TextIcon,
      onClick: () => setHeading(editor, "h3"),
    },
    {
      title: "Code Block",
      active: active === "h3",
      icon: TextIcon,
      onClick: () => setCodeBlock(editor),
    },
    {
      title: "Quote",
      active: active === "h3",
      icon: TextIcon,
      onClick: () => {},
    },
  ];
}

export function getFormatButtonOptions(
  editor: LexicalEditor,
  formats: EditorStyleState
): ToolbarButtonProps[] {
  return [
    {
      title: "Bold",
      active: formats.bold,
      icon: TextIcon,
      onClick: () => toggleBold(editor),
    },
    {
      title: "Italic",
      active: formats.italic,
      icon: TextIcon,
      onClick: () => toggleItalic(editor),
    },
    {
      title: "Underline",
      active: formats.underline,
      icon: TextIcon,
      onClick: () => toggleUnderline(editor),
    },
    {
      title: "Code",
      active: formats.code,
      icon: TextIcon,
      onClick: () => toggleCode(editor),
    },
    {
      title: "Unordered List",
      active: formats.isUnorderedList,
      icon: TextIcon,
      onClick: () => toggleUnorderedList(editor),
    },
    {
      title: "Ordered List",
      active: formats.isOrderedList,
      icon: TextIcon,
      onClick: () => toggleOrderedList(editor),
    },
    {
      title: "Link",
      active: formats.isLink,
      icon: TextIcon,
      onClick: () => insertLink(editor),
    },
    {
      title: "Image",
      active: formats.isImage,
      icon: TextIcon,
      onClick: () => insertImage(editor),
    },
  ];
}
