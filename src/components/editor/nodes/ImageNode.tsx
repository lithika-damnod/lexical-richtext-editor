import {
  $applyNodeReplacement,
  DecoratorNode,
  type LexicalNode,
  type NodeKey,
  type SerializedLexicalNode,
  type Spread,
} from "lexical";
import { type JSX } from "react";
import { ResizableImage } from "../ui";

export interface ImagePayload {
  key?: NodeKey;
  src: string;
  alt: string;
  width?: number;
  height?: number;
  maxWidth?: number;
}

export type SerializedImageNode = Spread<
  {
    alt: string;
    height?: number;
    maxWidth: number;
    src: string;
    width?: number;
  },
  SerializedLexicalNode
>;

export class ImageNode extends DecoratorNode<JSX.Element> {
  __src: string;
  __alt: string;
  __maxWidth: number;
  __width: "inherit" | number;
  __height: "inherit" | number;

  static getType(): string {
    return "img";
  }

  static clone(node: ImageNode): ImageNode {
    return new ImageNode(
      node.__src,
      node.__alt,
      node.__maxWidth,
      node.__width,
      node.__height,
      node.__key
    );
  }

  static importJSON(serializedNode: SerializedImageNode): ImageNode {
    const { src, alt, maxWidth, height, width } = serializedNode;
    return new ImageNode(
      src,
      alt,
      maxWidth,
      width ?? "inherit",
      height ?? "inherit"
    );
  }

  constructor(
    src: string,
    alt: string,
    maxWidth: number,
    width?: "inherit" | number,
    height?: "inherit" | number,
    key?: NodeKey
  ) {
    super(key);
    this.__src = src;
    this.__alt = alt;
    this.__maxWidth = maxWidth;
    this.__width = width || "inherit";
    this.__height = height || "inherit";
  }

  createDOM(): HTMLElement {
    return document.createElement("span");
  }

  updateDOM(): false {
    return false;
  }

  exportJSON(): SerializedImageNode {
    return {
      type: ImageNode.getType(),
      version: 1,
      src: this.__src,
      alt: this.__alt,
      maxWidth: this.__maxWidth,
      width: this.__width === "inherit" ? undefined : this.__width,
      height: this.__height === "inherit" ? undefined : this.__height,
    };
  }

  decorate(): JSX.Element {
    return <ResizableImage src={this.__src} nodeKey={this.getKey()} />;
  }
}

export function $createImageNode({
  src,
  alt,
  width,
  height,
  maxWidth,
  key,
}: ImagePayload) {
  return $applyNodeReplacement(
    new ImageNode(src, alt, maxWidth ?? 500, width, height, key)
  );
}

export function $isImageNode(
  node: LexicalNode | null | undefined
): node is ImageNode {
  return node instanceof ImageNode;
}
