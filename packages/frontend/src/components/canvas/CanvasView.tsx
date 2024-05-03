"use client";

import { getScreenDimensions } from "@/hooks/useScreenDimensions";
import { CircularProgress, styled } from "@mui/material";
import { ReactNode, useCallback, useEffect, useRef, useState } from "react";
import {
  ORIGIN,
  Point,
  addPoints,
  diffPoints,
  dividePoint,
  multiplyPoint,
} from "./point";

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
  position: fixed;
  height: 100vh;
  width: 100vw;
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

const SCALE_FACTOR = 0.2;
const MAX_ZOOM = 10;
const MIN_ZOOM = 0.5;

export interface CanvasViewProps {
  imageUrl: string;
  children?: ReactNode;
}

export default function CanvasView({ imageUrl, children }: CanvasViewProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const lastMousePosRef = useRef(ORIGIN);

  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [zoom, setZoom] = useState(1);
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
      setZoom(getDefaultScale(image));
    };
    image.src = imageUrl;

    return () => {
      // Remove the onload handler to prevent a redundant GET request being made.
      image.onload = null;
    };
  }, [imageUrl]);

  /********************************
   * ZOOMING FUNCTIONALITY.       *
   ********************************/

  useEffect(() => {
    if (!image) return;

    const handleWheel = (event: WheelEvent): void => {
      event.preventDefault();

      const mousePositionOnCanvas: Point = {
        x: event.offsetX,
        y: event.offsetY,
      };

      // Offset to get to the mouse position
      const mouseOffsetDirection = diffPoints(
        { x: image.width / 2, y: image.height / 2 },
        mousePositionOnCanvas,
      );

      console.log(mouseOffsetDirection);

      const scale = Math.exp(Math.sign(-event.deltaY) * SCALE_FACTOR);
      const newZoom = clamp(zoom * scale, MIN_ZOOM, MAX_ZOOM);

      // Clamping the zoom means the actual scale may be different.
      const effectiveScale = newZoom / zoom;

      setOffset((prevOffset) => {
        const offsetDiffDirection = diffPoints(
          mouseOffsetDirection,
          prevOffset,
        );

        // The amount we move in the direction of the offset is based on how much we're zooming in
        const offsetDiff = multiplyPoint(
          offsetDiffDirection,
          effectiveScale - 1,
        );

        return clampOffset(addPoints(offsetDiff, prevOffset));
      });
      setZoom(newZoom);
    };

    canvasRef.current?.addEventListener("wheel", handleWheel);

    return () => canvasRef.current?.removeEventListener("wheel", handleWheel);
  }, [zoom, image]);

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

  const handleMouseMove = useCallback(
    (event: MouseEvent): void => {
      const lastMousePos = lastMousePosRef.current;
      const currentMousePos: Point = { x: event.pageX, y: event.pageY }; // use document so can pan off element
      lastMousePosRef.current = currentMousePos;

      const mouseDiff = dividePoint(
        diffPoints(currentMousePos, lastMousePos),
        zoom,
      );

      setOffset((prevOffset) => {
        const newOffset = addPoints(prevOffset, mouseDiff);
        return clampOffset(newOffset);
      });
    },
    [zoom, clampOffset],
  );

  /**
   * Remove the mouse move listener when the mouse is released to stop panning.
   */
  const handleMouseUp = useCallback((): void => {
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
  }, [handleMouseMove]);

  /**
   * Only add the mouse move listener when you click down so that moving your mouse normally doesn't
   * cause the canvas to pan.
   */
  const handleStartPan = useCallback(
    (event: React.MouseEvent<HTMLDivElement, MouseEvent>): void => {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      lastMousePosRef.current = { x: event.pageX, y: event.pageY };
    },
    [handleMouseMove, handleMouseUp],
  );

  return (
    <FullscreenContainer>
      <CanvasContainer onMouseDown={handleStartPan}>
        <div
          id="canvas-pan-and-zoom"
          style={{
            transform: `translate(${offset.x}px, ${offset.y}px)`,
            scale: zoom,
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
