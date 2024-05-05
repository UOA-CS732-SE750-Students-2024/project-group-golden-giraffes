"use client";

import { CircularProgress, styled } from "@mui/material";
import {
  ReactNode,
  Touch,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { ORIGIN, Point, addPoints, scalePoint } from "./point";

import { Dimensions, getScreenDimensions } from "@/hooks/useScreenDimensions";
import { clamp } from "@/util";
import { CanvasPicker } from ".";

const CanvasContainer = styled("div")`
  position: fixed;
  height: 100svh;
  width: 100svw;
  overflow: hidden;
  background-color: var(--discord-old-not-quite-black);
  border: var(--card-border);
  border-radius: var(--card-border-radius);
  display: flex;
  overflow: hidden;
  place-content: center;
  place-items: center;

  cursor: grab;
  :active {
    cursor: grabbing;
  }

  &,
  * & {
    user-select: none;
  }

  canvas {
    image-rendering: pixelated;
    max-width: inherit;
  }
`;

/**
 * Calculate the default scale to use for the canvas. This is the required scaling to get the canvas
 * to cover the entire screen.
 */
function getDefaultScale(image: HTMLImageElement): number {
  const screenDimensions = getScreenDimensions();

  // Don't add any padding on the initial scale for small devices
  const padding = screenDimensions.width < 500 ? 0 : 50;

  const scale = Math.min(
    (screenDimensions.width - padding) / image.width,
    (screenDimensions.height - padding) / image.height,
  );

  return scale;
}

export interface CanvasViewProps {
  imageUrl: string;
}

export default function CanvasView({ imageUrl }: CanvasViewProps) {
  const imageRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const startTouchesRef = useRef<Touch[]>([]);

  const [imageDimensions, setImageDimension] = useState<Dimensions | null>(
    null,
  );
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState(ORIGIN);

  const isLoading = imageDimensions === null;

  const handleLoadImage = useCallback((image: HTMLImageElement): void => {
    if (!canvasRef.current) return;

    const context = canvasRef.current.getContext("2d");
    if (!context) return;

    // We need to set the width of the canvas first, otherwise if the image is bigger than
    // the canvas it'll get cut off.
    canvasRef.current.width = image.width;
    canvasRef.current.height = image.height;

    context.drawImage(image, 0, 0);

    setScale(getDefaultScale(image));
    setImageDimension({ width: image.width, height: image.height });
  }, []);

  useEffect(() => {
    // The image onLoad doesn't always seem to fire, especially on reloads. Instead, the image
    // seems pre-loaded. This may have something to do with SSR, or browser image caching. We'll
    // need to check it's working correctly when we start placing pixels.
    if (imageRef.current?.complete) {
      handleLoadImage(imageRef.current);
    }
  }, [handleLoadImage]);

  useEffect(() => {
    // Prevent the default touch move behaviour on the document to prevent pull to refresh.
    const handleDocumentTouchMove = (event: TouchEvent): void => {
      event.preventDefault();
    };

    document.addEventListener("touchmove", handleDocumentTouchMove, {
      passive: false,
    });

    return () =>
      document.removeEventListener("touchmove", handleDocumentTouchMove);
  }, []);

  /********************************
   * PANNING FUNCTIONALITY.       *
   ********************************/

  /**
   * Ensure that the offset is within bounds. This is defined as at least half the canvas being on
   * screen along an axis.
   */
  const clampOffset = useCallback(
    (offset: Point): Point => {
      if (imageDimensions == null) return offset;

      const widthLimit = imageDimensions.width / 2;
      const heightLimit = imageDimensions.height / 2;

      return {
        x: clamp(offset.x, -widthLimit, widthLimit),
        y: clamp(offset.y, -heightLimit, heightLimit),
      };
    },
    [imageDimensions],
  );

  const updateOffset = useCallback(
    (diff: Point): void => {
      const scaledDiff = scalePoint(diff, scale);

      setOffset((prevOffset) => {
        const newOffset = addPoints(prevOffset, scaledDiff);
        return clampOffset(newOffset);
      });
    },
    [scale, clampOffset],
  );

  const handleMouseMove = useCallback(
    (event: MouseEvent): void => {
      updateOffset({ x: event.movementX, y: event.movementY });
    },
    [updateOffset],
  );

  /**
   * Remove the listeners when the mouse is released to stop panning.
   */
  const handleMouseUp = useCallback((): void => {
    if (!containerRef.current) return;

    containerRef.current.removeEventListener("mousemove", handleMouseMove);
    containerRef.current.removeEventListener("mouseup", handleMouseUp);
  }, [handleMouseMove]);

  /**
   * Only add the mouse move listener when you click down so that moving your mouse normally doesn't
   * cause the canvas to pan.
   */
  const handleStartMousePan = useCallback((): void => {
    if (!containerRef.current) return;

    containerRef.current.addEventListener("mousemove", handleMouseMove);
    containerRef.current.addEventListener("mouseup", handleMouseUp);
  }, [handleMouseMove, handleMouseUp]);

  const handleTouchMove = useCallback(
    (event: TouchEvent): void => {
      const touchCount = event.touches.length;
      event.preventDefault();

      // TODO: Implement multi-touch zooming
      if (touchCount !== 1) return;

      // Check that the touch event is the same as the one that started the pan
      if (event.touches[0].identifier !== startTouchesRef.current[0].identifier)
        return;

      const startTouch = startTouchesRef.current[0];
      const touch = event.touches[0];

      const touchDiff: Point = {
        x: touch.pageX - startTouch.pageX,
        y: touch.pageY - startTouch.pageY,
      };

      updateOffset({ x: touchDiff.x, y: touchDiff.y });
      startTouchesRef.current = [touch];
    },
    [updateOffset],
  );

  const handleTouchEnd = useCallback((): void => {
    if (!containerRef.current) return;

    containerRef.current.removeEventListener("touchmove", handleTouchMove);
    containerRef.current.removeEventListener("touchend", handleTouchEnd);
    containerRef.current.removeEventListener("touchcancel", handleTouchEnd);
  }, [handleTouchMove]);

  /**
   * Note: The `React` prefix to `TouchEvent` is necessary to distinguish it from the non-react
   * version used by handleTouchMove.
   */
  const handleStartTouchPan = useCallback(
    (event: React.TouchEvent<HTMLDivElement>): void => {
      if (!containerRef.current) return;

      const touchCount = event.touches.length;

      // TODO: Implement multi-touch zooming
      if (touchCount !== 1) return;

      containerRef.current.addEventListener("touchmove", handleTouchMove, {
        passive: false,
      });
      containerRef.current.addEventListener("touchend", handleTouchEnd);
      containerRef.current.addEventListener("touchcancel", handleTouchEnd);
      startTouchesRef.current = Array.from(event.touches);
    },
    [handleTouchMove, handleTouchEnd],
  );

  return (
    <>
      <CanvasPicker />
      <CanvasContainer
        ref={containerRef}
        onMouseDown={handleStartMousePan}
        onTouchStart={handleStartTouchPan}
      >
        {isLoading && <CircularProgress />}
        <canvas
          ref={canvasRef}
          id="canvas-pan-and-zoom"
          style={{
            transform: `translate(${offset.x}px, ${offset.y}px)`,
            scale,
          }}
        />
      </CanvasContainer>
      <img
        alt="Blurple Canvas 2023"
        hidden
        onLoad={(event) => handleLoadImage(event.currentTarget)}
        ref={imageRef}
        src={imageUrl}
      />
    </>
  );
}
