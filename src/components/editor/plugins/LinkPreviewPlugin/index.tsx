import { useEffect, useState, type JSX } from "react";
import { $getSelection, $isRangeSelection } from "lexical";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { mergeRegister } from "@lexical/utils";
import { $isLinkNode } from "@lexical/link";
import { Box, Button, Grow, Popper, SvgIcon } from "@mui/material";
import { LinkIcon } from "../../icons";
import "./styles.css";

export function LinkPreviewPlugin(): JSX.Element | null {
  const [editor] = useLexicalComposerContext();
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [open, setOpen] = useState(false);

  const toggleLinkPreview = (event: MouseEvent) => {
    event.preventDefault();
    const target = event.target as HTMLElement;
    const parentAnchor = target.closest("a");

    if (parentAnchor) {
      setAnchorEl(parentAnchor as any);
      setOpen(true);
    } else setOpen(false);
  };

  useEffect(() => {
    return mergeRegister(
      editor.registerUpdateListener(() => {
        editor.update(() => {
          const selection = $getSelection();
          if (!$isRangeSelection(selection) || !selection.isCollapsed()) return;

          const anchorNode = selection.anchor.getNode();
          const parent = anchorNode.getParent();

          if ($isLinkNode(parent)) {
          }
        });
      }),

      editor.registerRootListener((root, prev) => {
        root?.addEventListener("click", toggleLinkPreview);
        prev?.removeEventListener("click", toggleLinkPreview);
      })
    );
  });

  return (
    <Popper
      disablePortal
      open={open}
      anchorEl={anchorEl}
      modifiers={[
        {
          name: "eventListeners",
          options: { scroll: true, resize: true },
        },
        {
          name: "preventOverflow",
          enabled: false,
        },
      ]}
      transition
    >
      {({ TransitionProps }) => (
        <Grow in={open} {...TransitionProps} timeout={400}>
          <Box className="preview__container">
            <div className="preview__content">
              <div className="preview__link-icon">
                <SvgIcon
                  component={LinkIcon}
                  inheritViewBox
                  sx={{
                    fontSize: "36px",
                  }}
                />
              </div>
              <span className="preview__url">https://example.com/example</span>
            </div>
            <div className="reference__actions">
              {/* <Button>
                <SvgIcon
                  component={LinkIcon}
                  inheritViewBox
                  sx={{
                    fontSize: "32px",
                  }}
                />
              </Button>
              <Button>
                <SvgIcon
                  component={LinkIcon}
                  inheritViewBox
                  sx={{
                    fontSize: "32px",
                  }}
                />
              </Button> */}
            </div>
          </Box>
        </Grow>
      )}
    </Popper>
  );
}
