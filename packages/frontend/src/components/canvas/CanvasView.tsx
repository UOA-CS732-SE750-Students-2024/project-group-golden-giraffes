"use client";

import { getScreenDimensions } from "@/hooks/useScreenDimensions";
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

const FullscreenContainer = styled("main")`
  position: fixed;

  > * {
    position: relative;
  }

  .loader {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
`;

const CanvasContainer = styled("div")`
  overscroll-behavior: contain;
  position: fixed;
  height: 100svh;
  width: 100svw;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;

  canvas {
    image-rendering: pixelated;
    max-width: inherit;
  }
`;

/**
 * Return the value clamped so that it is within the range [min, max].
 */
function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

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
  children?: ReactNode;
}

export default function CanvasView({ imageUrl, children }: CanvasViewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const startTouchesRef = useRef<Touch[]>([]);

  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState(ORIGIN);

  const isLoading = image === null;

  useEffect(() => {
    const image = new Image();
    image.onload = () => {
      if (!canvasRef.current) return;

      const context = canvasRef.current.getContext("2d");
      if (!context) return;

      // We need to set the width of the canvas first, otherwise if the image is bigger than
      // the canvas it'll get cut off.
      canvasRef.current.width = image.width;
      canvasRef.current.height = image.height;

      context.drawImage(image, 0, 0);

      setImage(image);
      setScale(getDefaultScale(image));
    };
    image.src = imageUrl;

    return () => {
      // Remove the onload handler to prevent a redundant GET request being made.
      image.onload = null;
    };
  }, [imageUrl]);

  /********************************
   * PANNING FUNCTIONALITY.       *
   ********************************/

  /**
   * Ensure that the offset is within bounds. This is defined as at least half the canvas being on
   * screen along an axis.
   */
  const clampOffset = useCallback(
    (offset: Point): Point => {
      if (image == null) return offset;

      const widthLimit = image.width / 2;
      const heightLimit = image.height / 2;

      return {
        x: clamp(offset.x, -widthLimit, widthLimit),
        y: clamp(offset.y, -heightLimit, heightLimit),
      };
    },
    [image],
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

      containerRef.current.addEventListener("touchmove", handleTouchMove);
      containerRef.current.addEventListener("touchend", handleTouchEnd);
      containerRef.current.addEventListener("touchcancel", handleTouchEnd);
      startTouchesRef.current = Array.from(event.touches);
    },
    [handleTouchMove, handleTouchEnd],
  );

  return (
    <FullscreenContainer>
      <CanvasContainer
        ref={containerRef}
        onMouseDown={handleStartMousePan}
        onTouchStart={handleStartTouchPan}
      >
        <div
          id="canvas-pan-and-zoom"
          style={{
            transform: `translate(${offset.x}px, ${offset.y}px)`,
            scale,
          }}
        >
          <canvas ref={canvasRef} />
        </div>
      </CanvasContainer>
      {isLoading && <CircularProgress className="loader" />}
      {children}
    </FullscreenContainer>
  );
}
