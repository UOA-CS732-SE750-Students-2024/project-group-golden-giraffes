"use client";

import { Typography, styled } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import AnimatedText from "../loaders/AnimatedText";

export interface CanvasViewProps {
  imageUrl: string;
}

const CanvasContainer = styled("div")`
  display: flex;
  justify-content: center;
`;

export default function CanvasView({ imageUrl }: CanvasViewProps) {
  const [isLoading, setIsLoading] = useState(true);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    setIsLoading(true);
    const start = Date.now();

    const image = new Image();
    image.onload = () => {
      if (!canvasRef.current) return;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      console.log(`Loaded image in ${Date.now() - start}ms`);
      setIsLoading(false);

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
      <canvas ref={canvasRef} id="canvas" width={0} height={0} />
      {isLoading && <AnimatedText>Loading</AnimatedText>}
    </CanvasContainer>
  );
}
