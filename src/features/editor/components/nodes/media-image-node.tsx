import { ResizableProvider, useResizableValue } from "@platejs/resizable";
import { type TElement } from "platejs";
import { PlateElement, withHOC, type PlateElementProps } from "platejs/react";
import { useContext, useState } from "react";

import { HoverAnimatedImage } from "@/components/media/hover-animated-image";
import { Resizable, ResizeHandle } from "@/components/ui/resize-handle";
import { MediaContext } from "@/features/editor/media-context";

export const MediaImageElement = withHOC(
  ResizableProvider,
  function MediaImageElement(props: PlateElementProps) {
    const media = useContext(MediaContext);
    const width = useResizableValue("width");
    const [naturalAspectRatio, setNaturalAspectRatio] = useState<number>();
    const element = props.element as TElement & {
      alt?: string;
      caption?: string;
      mediaId?: string;
      mediaType?: "audio" | "file" | "image" | "video";
    };
    const item = media.get(element.mediaId ?? "");
    const mediaType = element.mediaType ?? "image";
    const imageMaxWidth = naturalAspectRatio ? 32 * 16 * naturalAspectRatio : "100%";

    return (
      <PlateElement {...props} as="figure">
        <div contentEditable={false}>
          {item && mediaType === "image" ? (
            <Resizable
              align="center"
              className="group"
              options={{ align: "center", maxWidth: imageMaxWidth, minWidth: 120 }}
            >
              <ResizeHandle direction="left" options={{ direction: "left" }} />
              <HoverAnimatedImage
                src={item.url}
                alt={element.alt || item.altText || ""}
                containerClassName="w-full"
                className="w-full"
                onLoad={(event) => {
                  const image = event.currentTarget;
                  if (image.naturalWidth && image.naturalHeight) {
                    setNaturalAspectRatio(image.naturalWidth / image.naturalHeight);
                  }
                }}
              />
              <ResizeHandle direction="right" options={{ direction: "right" }} />
            </Resizable>
          ) : null}
          {item && mediaType === "video" ? (
            <video src={item.url} controls>
              <track kind="captions" />
            </video>
          ) : null}
          {item && mediaType === "audio" ? (
            <audio src={item.url} controls>
              <track kind="captions" />
            </audio>
          ) : null}
          {item && mediaType === "file" ? (
            <a href={item.url} target="_blank" rel="noreferrer">
              {item.filename}
            </a>
          ) : null}
          {element.caption ? (
            <figcaption
              style={{ "--dynamic-width": typeof width === "number" ? width + "px" : width }}
              className="w-(--dynamic-width)"
            >
              {element.caption}
            </figcaption>
          ) : null}
        </div>
        {props.children}
      </PlateElement>
    );
  },
);
