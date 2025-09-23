import { Resizable } from "re-resizable";
import { useEffect, useRef, useState } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";

import { DELETE_IMAGE_COMMAND } from "../../plugins/ImagePlugin";
import "./styles.css";

interface ImageProps {
  src: string;
  nodeKey: string;
}

export function ResizableImage({ src, nodeKey }: ImageProps) {
  const [editor] = useLexicalComposerContext();
  const resizableWrapperRef = useRef<Resizable | null>(null);
  const imageContainerRef = useRef<HTMLDivElement | null>(null);
  const [resizableWidth, setResizableWidth] = useState<string | null>(null);
  const [selected, setSelected] = useState(false);

  useEffect(() => createImageAndAppend(), [src]);
  useEffect(() => {
    document.addEventListener("mousedown", handleDeselect);
    return () => {
      document.removeEventListener("mousedown", handleDeselect);
    };
  }, []);
  useEffect(() => {
    document.addEventListener("keydown", handleDeleteKeyPress);
    return () => {
      document.removeEventListener("keydown", handleDeleteKeyPress);
    };
  }, [selected]);

  const calculateRelativeWidth = (childWidth: number, parentWidth: number) => {
    if (!parentWidth) return "100%";

    if (childWidth >= parentWidth) return "100%";

    const percentage = (childWidth / parentWidth) * 100;
    return `${percentage.toFixed(2)}%`;
  };

  const createImageAndAppend = () => {
    const image = new Image();
    image.src = src;

    image.onload = () => handleImageLoad(image);

    if (imageContainerRef.current) {
      imageContainerRef.current.innerHTML = "";
      imageContainerRef.current.appendChild(image);
    }
  };

  const handleImageLoad = (image: HTMLImageElement) => {
    setResizableWidth(
      calculateRelativeWidth(
        image.naturalWidth,
        resizableWrapperRef.current?.getParentSize().width ?? 0
      )
    );
  };

  const handleResizeStop = (
    _event: unknown,
    _direction: unknown,
    resizedElement: HTMLElement
  ) => {
    setResizableWidth(resizedElement.style.width);
  };

  const handleSelect = () => {
    setSelected(true);
  };

  const handleDeselect = (event: MouseEvent) => {
    if (!resizableWrapperRef.current) return;

    const node = resizableWrapperRef.current.resizable;
    if (node && !node.contains(event.target as Node)) setSelected(false);
  };

  const handleDeleteKeyPress = (event: KeyboardEvent) => {
    if (!selected) return;

    if (event.key == "Delete" || event.key === "Backspace") {
      console.log("delete running");

      editor.dispatchCommand(DELETE_IMAGE_COMMAND, {
        key: nodeKey,
      });
    }
  };

  return (
    <Resizable
      size={{
        width: resizableWidth ?? 0,
      }}
      enable={
        selected
          ? {
              topRight: true,
              bottomRight: true,
              bottomLeft: true,
              topLeft: true,
            }
          : {}
      }
      bounds="parent"
      lockAspectRatio
      ref={resizableWrapperRef}
      onResizeStop={handleResizeStop}
    >
      <div className={selected ? "selected" : ""} onClick={handleSelect}>
        <div ref={imageContainerRef} />
        <span></span>
      </div>
    </Resizable>
  );
}
