import type { LexicalEditor } from "lexical";
import {
  insertImage,
  insertLink,
  setCodeBlock,
  setHeading,
  setParagraph,
  setQuote,
  toggleBold,
  toggleCode,
  toggleItalic,
  toggleOrderedList,
  toggleStrikethrough,
  toggleUnderline,
  toggleUnorderedList,
} from "./utils";
import type { BlockType, EditorStyleState } from "../../hooks";
import type { PopoverItemProps, ToolbarButtonProps } from "../../ui";
import {
  BoldIcon,
  CodeIcon,
  HeadingOneIcon,
  HeadingThreeIcon,
  HeadingTwoIcon,
  ImageIcon,
  ItalicIcon,
  LinkIcon,
  OrderedListIcon,
  QuoteIcon,
  StrikethroughIcon,
  TextColorIcon,
  TextIcon,
  UnderlineIcon,
  UnorderedListIcon,
} from "../../icons";

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
      icon: HeadingOneIcon,
      onClick: () => setHeading(editor, "h1"),
    },
    {
      title: "Heading 2",
      active: active == "h2",
      icon: HeadingTwoIcon,
      onClick: () => setHeading(editor, "h2"),
    },
    {
      title: "Heading 3",
      active: active == "h3",
      icon: HeadingThreeIcon,
      onClick: () => setHeading(editor, "h3"),
    },
    {
      title: "Code Block",
      active: active === "code",
      icon: CodeIcon,
      onClick: () => setCodeBlock(editor),
    },
    {
      title: "Quote",
      active: active === "quote",
      icon: QuoteIcon,
      onClick: () => setQuote(editor),
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
      icon: BoldIcon,
      onClick: () => toggleBold(editor),
    },
    {
      title: "Italic",
      active: formats.italic,
      icon: ItalicIcon,
      onClick: () => toggleItalic(editor),
    },
    {
      title: "Underline",
      active: formats.underline,
      icon: UnderlineIcon,
      onClick: () => toggleUnderline(editor),
    },
    {
      title: "Text Color",
      active: false,
      icon: TextColorIcon,
      onClick: () => {},
    },
    {
      title: "Strikethrough",
      active: formats.strikethrough,
      icon: StrikethroughIcon,
      onClick: () => toggleStrikethrough(editor),
    },
    {
      title: "Code",
      active: formats.code,
      icon: CodeIcon,
      onClick: () => toggleCode(editor),
    },
    {
      title: "Unordered List",
      active: formats.isUnorderedList,
      icon: UnorderedListIcon,
      onClick: () => toggleUnorderedList(editor),
    },
    {
      title: "Ordered List",
      active: formats.isOrderedList,
      icon: OrderedListIcon,
      onClick: () => toggleOrderedList(editor),
    },
    {
      title: "Link",
      active: formats.isLink,
      icon: LinkIcon,
      onClick: () => insertLink(editor),
    },
    {
      title: "Image",
      active: false,
      icon: ImageIcon,
      onClick: () => insertImage(editor),
    },
  ];
}

export const TEXT_COLORS = [
  "#000000",
  "#ff0000",
  "#1c76dd",
  "#40a33f",
  "#8d8d8c",
] as const;
