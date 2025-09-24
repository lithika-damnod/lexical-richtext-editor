import { useMemo } from "react";
import { SvgIcon } from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";

import {
  ChevronIcon,
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
} from "../../ui";
import { handleRedo, handleUndo } from "./utils";
import { usePopover, useToolbarState } from "../../hooks";
import { getBlockTypeOptions, getFormatButtonOptions } from "./config";
import "./styles.css";

export function ToolbarPlugin() {
  const [editor] = useLexicalComposerContext();
  const { blockType, formats, canUndo, canRedo } = useToolbarState(editor);

  const isScreenMediumWidth = useMediaQuery("(min-width: 650px)");
  const isScreenLargeWidth = useMediaQuery("(min-width: 900px)");

  const blockOptions = useMemo(
    () => getBlockTypeOptions(editor, blockType),
    [editor, blockType]
  );

  const formatOptions = useMemo((): {
    visible: ToolbarButtonProps[];
    hidden: ToolbarButtonProps[];
  } => {
    const all = getFormatButtonOptions(editor, formats);
    const active = all.find((option: ToolbarButtonProps) => option.active); // finds the first active option

    return isScreenLargeWidth
      ? { visible: all, hidden: [] }
      : isScreenMediumWidth
        ? { visible: all.slice(0, 4), hidden: all.slice(4) }
        : { visible: active ? [active] : [], hidden: all };
  }, [editor, formats, isScreenLargeWidth, isScreenMediumWidth]);

  const blockTypePopover = usePopover();
  const toolbarOverflowPopover = usePopover();

  return (
    <div className="toolbar">
      <div>
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
      <div>
        <ToolbarBlockTypeButton
          icon={blockOptions.find((option) => option.active)?.icon ?? TextIcon}
          opened={blockTypePopover.isOpen}
          onClick={blockTypePopover.open}
        />
        <div>
          <div>
            {formatOptions.visible.map((button, index) => (
              <ToolbarButton
                key={index}
                title={button.title}
                active={button.active}
                icon={button.icon}
                onClick={button.onClick}
              />
            ))}
          </div>
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
    </div>
  );
}
