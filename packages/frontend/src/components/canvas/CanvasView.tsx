"use client";

import { CircularProgress, styled } from "@mui/material";
import {
  ReactNode,
  useCallback,
  useEffect,
  useLayoutEffect,
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
    width: 100%;
    height: 100%;
    object-fit: cover;
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

function getViewportDimensions(): Dimensions {
  const htmlElement = document.documentElement;

  // This doesn't include the scrollbar width
  return {
    width: htmlElement.clientWidth,
    height: htmlElement.clientHeight,
  };
}

export default function CanvasView({ imageUrl, children }: CanvasViewProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const lastOffsetRef = useRef(ORIGIN);
  const lastMousePosRef = useRef(ORIGIN);

  const [isLoading, setIsLoading] = useState(true);
  const [context, setContext] = useState<CanvasRenderingContext2D | null>(null);
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState(ORIGIN);
  const [mousePos, setMousePos] = useState<Point>(ORIGIN);

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

      console.log(`Loaded image in ${Date.now() - start}ms`);

      setImage(image);
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

  const handleMouseMove = useCallback((event: MouseEvent) => {
    const lastMousePos = lastMousePosRef.current;
    const currentMousePos: Point = { x: event.pageX, y: event.pageY }; // use document so can pan off element
    lastMousePosRef.current = currentMousePos;

    const mouseDiff = diffPoints(currentMousePos, lastMousePos);

    setOffset((prevOffset) => addPoints(prevOffset, mouseDiff));
  }, []);

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
        style={{ transform: `translate(${offset.x}px, ${offset.y}px)` }}
      />
      {isLoading && <CircularProgress className="loader" />}
      {children}
    </FullscreenContainer>
  );
}
