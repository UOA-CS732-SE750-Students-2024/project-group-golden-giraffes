import config from "@/config";
import {
  useActiveCanvasContext,
  useSelectedColorContext,
  useSelectedPixelLocationContext,
} from "@/contexts";
import { styled } from "@mui/material";
import axios from "axios";
import { Button } from "./Button";
import DynamicButton from "./DynamicButton";

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

  const handlePixelRequest = () => {
    if (!coords || !color) return;

    const requestUrl = `${config.apiUrl}/api/v1/canvas/${canvas.id}/pixel`;

    const body = {
      x: coords.x,
      y: coords.y,
      colorId: color.id,
    };

    try {
      axios.post(requestUrl, body, {
        withCredentials: true,
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
