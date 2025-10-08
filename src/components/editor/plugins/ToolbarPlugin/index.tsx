import { useMemo } from "react";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";

import {
  LeftAlignIcon,
  MenuIcon,
  RedoIcon,
  TextIcon,
  UndoIcon,
} from "../../icons";
import {
  ToolbarButton,
  Popover,
  PopoverItem,
  type ToolbarButtonProps,
  ToolbarBlockTypeButton,
  ColorPickerPopover,
} from "../../ui";
import { handleRedo, handleUndo, setTextColor } from "./utils";
import { usePopover, useToolbarState } from "../../hooks";
import { getBlockTypeOptions, getFormatButtonOptions } from "./config";
import "./styles.css";

export function ToolbarPlugin() {
  const [editor] = useLexicalComposerContext();
  const { blockType, formats, canUndo, canRedo } = useToolbarState(editor);

  const isScreenMediumWidth = useMediaQuery("(min-width: 700px)");
  const isScreenLargeWidth = useMediaQuery("(min-width: 1000px)");

  const blockOptions = useMemo(
    () => getBlockTypeOptions(editor, blockType),
    [editor, blockType]
  );

  const formatOptions = useMemo((): {
    visible: ToolbarButtonProps[];
    hidden: ToolbarButtonProps[];
  } => {
    const all = getFormatButtonOptions(editor, formats);
    const pinned = [all[3]];

    return isScreenLargeWidth
      ? { visible: all, hidden: [] }
      : isScreenMediumWidth
        ? { visible: all.slice(0, 4), hidden: all.slice(4) }
        : {
            visible: pinned,
            hidden: all.filter((item) => !pinned.includes(item)),
          };
  }, [editor, formats, isScreenLargeWidth, isScreenMediumWidth]);

  const blockTypePopover = usePopover();
  const toolbarOverflowPopover = usePopover();
  const textColorPopover = usePopover();

  return (
    <div className="toolbar">
      <div className="toolbar-history-group">
        <ToolbarButton
          title="Undo"
          active={false}
          disabled={!canUndo}
          icon={UndoIcon}
          onClick={() => {
            handleUndo(editor);
          }}
        />
        <ToolbarButton
          title="Redo"
          active={false}
          disabled={!canRedo}
          icon={RedoIcon}
          onClick={() => {
            handleRedo(editor);
          }}
        />
      </div>
      <div className="toolbar-formatting-container">
        <div className="toolbar-text-type-group">
          <ToolbarBlockTypeButton
            icon={
              blockOptions.find((option) => option.active)?.icon ?? TextIcon
            }
            opened={blockTypePopover.isOpen}
            onClick={blockTypePopover.open}
          />
        </div>
        <div className="toolbar-formatting-group">
          {formatOptions.visible.map((button, index) => (
            <ToolbarButton
              key={index}
              title={button.title}
              active={button.active}
              icon={button.icon}
              onClick={
                button.title === "Text Color"
                  ? (event) => event && textColorPopover.open(event)
                  : button.onClick
              }
            />
          ))}
          {!isScreenLargeWidth && (
            <ToolbarButton
              title="More"
              active={false}
              icon={MenuIcon}
              onClick={(event) => event && toolbarOverflowPopover.open(event)}
            />
          )}
        </div>
      </div>
      <Popover
        open={blockTypePopover.isOpen}
        anchorEl={blockTypePopover.anchorEl}
        onClose={blockTypePopover.close}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
      >
        {blockOptions.map((option, index) => (
          <PopoverItem
            key={index}
            title={option.title}
            active={option.active}
            icon={option.icon}
            onClick={() => {
              if (option.onClick) option.onClick();
              setTimeout(blockTypePopover.close, 0);
            }}
          />
        ))}
      </Popover>
      <Popover
        open={toolbarOverflowPopover.isOpen}
        anchorEl={toolbarOverflowPopover.anchorEl}
        onClose={toolbarOverflowPopover.close}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        {formatOptions.hidden.map((option, index) => (
          <PopoverItem
            key={index}
            title={option.title}
            active={option.active}
            icon={option.icon}
            onClick={() => {
              if (option.onClick) option.onClick();
              setTimeout(toolbarOverflowPopover.close, 0);
            }}
          />
        ))}
      </Popover>
      <ColorPickerPopover
        value={formats.color}
        open={textColorPopover.isOpen}
        anchorEl={textColorPopover.anchorEl}
        onClose={textColorPopover.close}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        marginThreshold={60}
        onColorChange={(color) => setTextColor(editor, color)}
      />
    </div>
  );
}
