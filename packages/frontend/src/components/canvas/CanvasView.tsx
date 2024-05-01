"use client";

import { CircularProgress, styled } from "@mui/material";
import { ReactNode, useEffect, useRef, useState } from "react";

export interface CanvasViewProps {
  imageUrl: string;
  children?: ReactNode;
}

const FullscreenContainer = styled("div")`
  height: 100vh;
  width: 100vw;
  overflow: hidden;

  & canvas {
    image-rendering: pixelated;
    position: fixed;
    z-index: -1;
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

export default function CanvasView({ imageUrl, children }: CanvasViewProps) {
  const [isLoading, setIsLoading] = useState(true);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    setIsLoading(true);

    const image = new Image();
    image.onload = () => {
      if (!canvasRef.current) return;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      setIsLoading(false);

      // We need to set the width of the canvas first, otherwise if the image is bigger than
      // the canvas it'll get cut off.
      canvas.width = image.width;
      canvas.height = image.height;
      ctx.drawImage(image, 0, 0);
    };
    image.src = imageUrl;

    return () => {
      // Remove the onload handler to prevent a redundant GET request being made.
      image.onload = null;
    };
  }, [imageUrl]);

  return (
    <FullscreenContainer>
      <canvas ref={canvasRef} id="canvas" />
      {isLoading && <CircularProgress className="loader" />}
      {children}
    </FullscreenContainer>
  );
}
