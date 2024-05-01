"use client";

import { Dimensions, useScreenDimensions } from "@/hooks/useScreenDimensions";
import { CircularProgress, styled } from "@mui/material";
import {
  ReactNode,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";

const FullscreenContainer = styled("div")`
  height: 100vh;
  width: 100vw;
  overflow: hidden;

  & > * {
    position: relative;
  }

  & canvas {
    image-rendering: pixelated;
    position: fixed;
    height: auto;
    max-width: inherit;
  }

  & .loader {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
`;

interface Point {
  x: number;
  y: number;
}

export interface CanvasViewProps {
  imageUrl: string;
  children?: ReactNode;
}

const ORIGIN: Point = { x: 0, y: 0 };

function diffPoints(p1: Point, p2: Point): Point {
  return { x: p1.x - p2.x, y: p1.y - p2.y };
}

function addPoints(p1: Point, p2: Point): Point {
  return { x: p1.x + p2.x, y: p1.y + p2.y };
}

// TODO: Round to nearest integer
function scalePoint(p1: Point, scale: number): Point {
  return { x: p1.x / scale, y: p1.y / scale };
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

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

/**
 * Get the offset required to centre the canvas on the screen.
 */
function getCentredCanvasOffset(
  effectiveCanvasDimensions: Dimensions,
  screenDimensions: Dimensions,
): Point {
  return {
    x: (screenDimensions.width - effectiveCanvasDimensions.width) / 2,
    y: (screenDimensions.height - effectiveCanvasDimensions.height) / 2,
  };
}

export default function CanvasView({ imageUrl, children }: CanvasViewProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const lastMousePosRef = useRef(ORIGIN);

  const screenDimensions = useScreenDimensions();

  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState(ORIGIN);
  const [mousePos, setMousePos] = useState(ORIGIN);

  const isLoading = image === null;

  // biome-ignore lint/correctness/useExhaustiveDependencies: We don't want to reload the image when the screen size changes.
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

      const effectiveCanvasDimensions = getEffectiveCanvasDimensions(
        image,
        screenDimensions,
      );

      const centredOrigin = getCentredCanvasOffset(
        effectiveCanvasDimensions,
        screenDimensions,
      );

      console.log(`Loaded image in ${Date.now() - start}ms`);

      setImage(image);
      setOffset(centredOrigin);
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
    (offset: Point, screenDimensions: Dimensions): Point => {
      if (image == null) return offset;

      const effectiveCanvasDimensions = getEffectiveCanvasDimensions(
        image,
        screenDimensions,
      );

      const centredOffset = getCentredCanvasOffset(
        effectiveCanvasDimensions,
        screenDimensions,
      );

      const widthLimit = effectiveCanvasDimensions.width / 2;
      const heightLimit = effectiveCanvasDimensions.height / 2;

      return {
        x: clamp(
          offset.x,
          -widthLimit + centredOffset.x,
          widthLimit + centredOffset.x,
        ),
        y: clamp(
          offset.y,
          -heightLimit + centredOffset.y,
          heightLimit + centredOffset.y,
        ),
      };
    },
    [image],
  );

  /**
   * Whenever the screen size changes, we need to check that the offset is still within bounds.
   */
  useEffect(() => {
    setOffset((prevOffset) => clampOffset(prevOffset, screenDimensions));
  }, [screenDimensions, clampOffset]);

  const handleMouseMove = useCallback(
    (event: MouseEvent) => {
      const lastMousePos = lastMousePosRef.current;
      const currentMousePos: Point = { x: event.pageX, y: event.pageY }; // use document so can pan off element
      lastMousePosRef.current = currentMousePos;

      const mouseDiff = diffPoints(currentMousePos, lastMousePos);

      setOffset((prevOffset) => {
        const newOffset = addPoints(prevOffset, mouseDiff);
        return clampOffset(newOffset, screenDimensions);
      });
    },
    [screenDimensions, clampOffset],
  );

  const handleMouseUp = useCallback(() => {
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
  }, [handleMouseMove]);

  const handleStartPan = useCallback(
    (event: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      lastMousePosRef.current = { x: event.pageX, y: event.pageY };
    },
    [handleMouseMove, handleMouseUp],
  );

  return (
    <FullscreenContainer>
      <canvas
        ref={canvasRef}
        onMouseDown={handleStartPan}
        style={{
          width: getEffectiveCanvasDimensions(image, screenDimensions).width,
          transform: `translate(${offset.x}px, ${offset.y}px)`,
        }}
      />
      {isLoading && <CircularProgress className="loader" />}
      {children}
    </FullscreenContainer>
  );
}
