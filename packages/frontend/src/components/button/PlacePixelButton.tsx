import config from "@/config";
import {
  useActiveCanvasContext,
  useAuthContext,
  useSelectedColorContext,
  useSelectedPixelLocationContext,
} from "@/contexts";
import { CircularProgress, styled } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { Button } from "./Button";
import DynamicButton from "./DynamicButton";

import { Cooldown } from "@blurple-canvas-web/types";

export const CoordinateLabel = styled("span")`
  opacity: 0.6;
`;

export default function PlacePixelButton() {
  const { coords, adjustedCoords, setCoords } =
    useSelectedPixelLocationContext();
  const { color, setColor } = useSelectedColorContext();
  const { canvas } = useActiveCanvasContext();
  const isSelected = adjustedCoords && color;
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [isPlacing, setIsPlacing] = useState<boolean>(false);
  const { user } = useAuthContext();

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

    setIsPlacing(true);
    axios
      .post<Cooldown>(requestUrl, body, {
        withCredentials: true,
      })
      .then((res) => res.data)
      .then((data) => {
        const cooldown = data.cooldownEndTime;
        if (cooldown) {
          setTimeLeft(
            Math.round((new Date(cooldown).valueOf() - Date.now()) / 1000),
          );
        }
        setIsPlacing(false);
      })
      .catch((e) => console.error(e));

    setColor(null);
    setCoords(null);
  };

  // Both these buttons never show as the logic is hoisted at the level above this
  // My issues with having it above is that the user has no indication of why they can't place pixels
  if (canvas.isLocked) {
    return <Button disabled>Canvas can't be modified</Button>;
  }
  if (!user) {
    return <Button disabled>Sign in to place pixels</Button>;
  }

  if (isPlacing) {
    return (
      <Button variant="contained" disabled>
        {"Placing Pixel"}
        <CircularProgress
          color="inherit"
          // Can't get sizing to work dynamically
          size="1.5rem"
          style={{ marginLeft: "1rem" }}
        />
      </Button>
    );
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
    <DynamicButton color={color} onAction={handlePixelRequest}>
      {isSelected ? "Place pixel" : "Select a pixel"}
      <CoordinateLabel>
        {isSelected ?
          `(${adjustedCoords.x},\u00A0${adjustedCoords.y})`
        : undefined}
      </CoordinateLabel>
    </DynamicButton>
  );
}
