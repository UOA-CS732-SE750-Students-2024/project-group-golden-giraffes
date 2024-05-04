"use client";

import { CircularProgress, styled } from "@mui/material";
import { useCallback, useEffect, useRef, useState } from "react";

import { Dimensions, getScreenDimensions } from "@/hooks/useScreenDimensions";
import { clamp } from "@/util";
import { ORIGIN, Point, addPoints, diffPoints, scalePoint } from "./point";

const CanvasContainer = styled("div")`
  border-radius: 1.5rem;
  border: oklch(100% 0 0 / 15%) solid 3px;
  display: flex;
  overflow: hidden;
  place-content: center;
  place-items: center;

  cursor: grab;
  :active {
    cursor: grabbing;
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

export default function CanvasView({ imageUrl }: { imageUrl: string }) {
  const imageRef = useRef<HTMLImageElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const lastMousePosRef = useRef(ORIGIN);

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

  const handleMouseMove = useCallback(
    (event: MouseEvent): void => {
      const lastMousePos = lastMousePosRef.current;
      const currentMousePos: Point = { x: event.pageX, y: event.pageY }; // use document so can pan off element
      lastMousePosRef.current = currentMousePos;

      const mouseDiff = scalePoint(
        diffPoints(currentMousePos, lastMousePos),
        scale,
      );

      setOffset((prevOffset) => {
        const newOffset = addPoints(prevOffset, mouseDiff);
        return clampOffset(newOffset);
      });
    },
    [scale, clampOffset],
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
    <>
      <CanvasContainer onMouseDown={handleStartPan}>
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
      {/* Some sort of wild performance optimisation */}
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
