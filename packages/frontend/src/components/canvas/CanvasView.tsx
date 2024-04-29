"use client";

import { styled } from "@mui/material";
import { useEffect, useRef } from "react";

export interface CanvasViewProps {
  imageUrl: string;
}

const CanvasContainer = styled("div")`
  display: flex;
  justify-content: center;
`;

export default function CanvasView({ imageUrl }: CanvasViewProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const image = new Image();
    image.onload = () => {
      if (!canvasRef.current) return;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      canvas.width = image.width;
      canvas.height = image.height;
      ctx.drawImage(image, 0, 0);
    };
    image.src = imageUrl;

    return () => {
      image.onload = null;
    };
  }, [imageUrl]);

  return (
    <CanvasContainer>
      <canvas ref={canvasRef} id="canvas" />
    </CanvasContainer>
  );
}
