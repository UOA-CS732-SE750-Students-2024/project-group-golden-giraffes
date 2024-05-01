"use client";

import { Dimensions } from "@/hooks/useScreenDimensions";
import { CircularProgress, styled } from "@mui/material";
import { ReactNode, useCallback, useEffect, useRef, useState } from "react";
import { ORIGIN, Point, addPoints, diffPoints } from "./point";

const FullscreenContainer = styled("div")`
  position: fixed;

  & > * {
    position: relative;
  }

  & .loader {
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

  & canvas {
    image-rendering: pixelated;
  }
`;

/**
 * Return the value clamped so that it is within the range [min, max].
 */
function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * Calculate the effective size of the canvas after scaling it up so that it covers the screen.
 */
function getEffectiveCanvasDimensions(
  image: HTMLImageElement | null,
  screenDimensions: Dimensions,
): Dimensions {
  if (!image) {
    return { width: 0, height: 0 };
  }

  const scale = Math.max(
    screenDimensions.width / image.width,
    screenDimensions.height / image.height,
  );
  const effectiveWidth = image.width * scale;
  const effectiveHeight = image.height * scale;

  return { width: effectiveWidth, height: effectiveHeight };
}

export interface CanvasViewProps {
  imageUrl: string;
  children?: ReactNode;
}

export default function CanvasView({ imageUrl, children }: CanvasViewProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const lastMousePosRef = useRef(ORIGIN);

  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [offset, setOffset] = useState(ORIGIN);

  const isLoading = image === null;

  useEffect(() => {
    const start = Date.now();

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

      console.log(`Loaded image in ${Date.now() - start}ms`);

      setImage(image);
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

  const handleMouseMove = useCallback(
    (event: MouseEvent): void => {
      const lastMousePos = lastMousePosRef.current;
      const currentMousePos: Point = { x: event.pageX, y: event.pageY }; // use document so can pan off element
      lastMousePosRef.current = currentMousePos;

      const mouseDiff = diffPoints(currentMousePos, lastMousePos);

      setOffset((prevOffset) => {
        const newOffset = addPoints(prevOffset, mouseDiff);
        return clampOffset(newOffset);
      });
    },
    [clampOffset],
  );

  const handleMouseUp = useCallback((): void => {
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
  }, [handleMouseMove]);

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
          id="canvas-panning"
          style={{
            transform: `translate(${offset.x}px, ${offset.y}px)`,
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
