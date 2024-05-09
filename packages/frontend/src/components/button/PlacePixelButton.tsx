import config from "@/config";
import {
  useActiveCanvasContext,
  useSelectedColorContext,
  useSelectedPixelLocationContext,
} from "@/contexts";
import { styled } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { Button } from "./Button";
import DynamicButton from "./DynamicButton";

import { Cooldown } from "@blurple-canvas-web/types";

interface PlacePixelButtonProps {
  disabled?: boolean;
}

export const CoordinateLabel = styled("span")`
  opacity: 0.6;
`;

export default function PlacePixelButton({ disabled }: PlacePixelButtonProps) {
  const { coords, adjustedCoords, setCoords } =
    useSelectedPixelLocationContext();
  const { color, setColor } = useSelectedColorContext();
  const { canvas } = useActiveCanvasContext();
  const isSelected = adjustedCoords && color;
  const [timeLeft, setTimeLeft] = useState<number>(0);

  // cooldown timer
  useEffect(() => {
    if (timeLeft) {
      const timerId = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
      return () => clearTimeout(timerId);
    }
    setTimeLeft(0);
  }, [timeLeft]);

  const handlePixelRequest = () => {
    if (!coords || !color) return;

    const requestUrl = `${config.apiUrl}/api/v1/canvas/${canvas.id}/pixel`;

    const body = {
      x: coords.x,
      y: coords.y,
      colorId: color.id,
    };

    try {
      axios
        .post(requestUrl, body, {
          withCredentials: true,
        })
        .then((res) => res.data)
        .then((data: Cooldown) => {
          const cooldown = data.cooldownEndTime;
          if (cooldown) {
            setTimeLeft(
              Math.round((new Date(cooldown).valueOf() - Date.now()) / 1000),
            );
          }
        });
    } catch (e) {
      console.error(e);
    }

    setColor(null);
    setCoords(null);
  };

  if (canvas.isLocked) {
    return <Button disabled>Can't place on read-only</Button>;
  }

  if (timeLeft > 0) {
    return (
      <Button variant="contained" disabled>
        On cooldown: {timeLeft} seconds left
      </Button>
    );
  }

  // Temporary fix to show disabled button because I
  // did not make the dynamic button component
  if (!color && !adjustedCoords) {
    return <Button disabled>Select a pixel and color</Button>;
  }
  if (!color) {
    return <Button disabled>Select a color</Button>;
  }
  if (!adjustedCoords) {
    return <Button disabled>Select a pixel</Button>;
  }

  return (
    <DynamicButton
      color={color}
      disabled={disabled}
      onAction={handlePixelRequest}
    >
      {isSelected ? "Place pixel" : "Select a pixel"}
      <CoordinateLabel>
        {isSelected ?
          `(${adjustedCoords.x},\u00A0${adjustedCoords.y})`
        : undefined}
      </CoordinateLabel>
    </DynamicButton>
  );
}
