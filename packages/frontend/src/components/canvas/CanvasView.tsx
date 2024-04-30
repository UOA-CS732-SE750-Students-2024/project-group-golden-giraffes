"use client";

import { CircularProgress, styled } from "@mui/material";
import {
  ReactNode,
  useCallback,
  useEffect,
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

interface Dimensions {
  width: number;
  height: number;
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

function getViewportDimensions(): Dimensions {
  const htmlElement = document.documentElement;

  // This doesn't include the scrollbar width
  return {
    width: htmlElement.clientWidth,
    height: htmlElement.clientHeight,
  };
}

function getEffectiveCanvasDimensions(
  image: HTMLImageElement | null,
): Dimensions {
  if (!image) {
    return { width: 0, height: 0 };
  }

  const viewport = getViewportDimensions();
  const scale = Math.max(
    viewport.width / image.width,
    viewport.height / image.height,
  );
  const effectiveWidth = image.width * scale;
  const effectiveHeight = image.height * scale;

  return { width: effectiveWidth, height: effectiveHeight };
}

function getCentredCanvasOrigin(effectiveCanvas: Dimensions): Point {
  const viewport = getViewportDimensions();

  return {
    x: (viewport.width - effectiveCanvas.width) / 2,
    y: (viewport.height - effectiveCanvas.height) / 2,
  };
}

export default function CanvasView({ imageUrl, children }: CanvasViewProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const lastOffsetRef = useRef(ORIGIN);
  const lastMousePosRef = useRef(ORIGIN);

  const [isLoading, setIsLoading] = useState(true);
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState(ORIGIN);
  const [mousePos, setMousePos] = useState<Point>(ORIGIN);

  const effectiveCanvas = useMemo(
    () => getEffectiveCanvasDimensions(image),
    [image],
  );

  useEffect(() => {
    setIsLoading(true);
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

      const effectiveCanvas = getEffectiveCanvasDimensions(image);
      const centredOrigin = getCentredCanvasOrigin(effectiveCanvas);

      console.log(`Loaded image in ${Date.now() - start}ms`);

      setImage(image);
      setOffset(centredOrigin);
      setIsLoading(false);
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

  const clampOffset = useCallback(
    (offset: Point): Point => {
      if (image == null) return offset;

      const centredOrigin = getCentredCanvasOrigin(effectiveCanvas);

      const widthLimit = effectiveCanvas.width / 2;
      const heightLimit = effectiveCanvas.height / 2;

      return {
        x: clamp(
          offset.x,
          -widthLimit + centredOrigin.x,
          widthLimit + centredOrigin.x,
        ),
        y: clamp(
          offset.y,
          -heightLimit + centredOrigin.y,
          heightLimit + centredOrigin.y,
        ),
      };
    },
    [effectiveCanvas, image],
  );

  const handleMouseMove = useCallback(
    (event: MouseEvent) => {
      const lastMousePos = lastMousePosRef.current;
      const currentMousePos: Point = { x: event.pageX, y: event.pageY }; // use document so can pan off element
      lastMousePosRef.current = currentMousePos;

      const mouseDiff = diffPoints(currentMousePos, lastMousePos);

      setOffset((prevOffset) => clampOffset(addPoints(prevOffset, mouseDiff)));
    },
    [clampOffset],
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
          width: effectiveCanvas.width,
          height: effectiveCanvas.height,
          transform: `translate(${offset.x}px, ${offset.y}px)`,
        }}
      />
      {isLoading && <CircularProgress className="loader" />}
      {children}
    </FullscreenContainer>
  );
}
