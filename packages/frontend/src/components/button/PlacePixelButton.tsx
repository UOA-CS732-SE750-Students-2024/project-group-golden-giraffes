import config from "@/config";
import {
  useActiveCanvasContext,
  useSelectedColorContext,
  useSelectedPixelLocationContext,
} from "@/contexts";
import { styled } from "@mui/material";
import axios from "axios";
import DynamicButton from "./DynamicButton";

interface PlacePixelButtonProps {
  disabled?: boolean;
}

export const CoordinateLabel = styled("span")`
  opacity: 0.6;
`;

export default function PlacePixelButton({ disabled }: PlacePixelButtonProps) {
  const { adjustedCoords, setCoords } = useSelectedPixelLocationContext();
  const { color: selectedColor, setColor: setSelectedColor } =
    useSelectedColorContext();
  const { canvas } = useActiveCanvasContext();

  const selectedCoordinates = adjustedCoords;
  const x = selectedCoordinates?.x;
  const y = selectedCoordinates?.y;
  const isSelected = selectedCoordinates && selectedColor;

  const handlePixelRequest = () => {
    if (!selectedCoordinates || !selectedColor) return;

    const requestUrl = `${config.apiUrl}/api/v1/canvas/${canvas.id}/pixel`;

    const body = {
      x: selectedCoordinates.x,
      y: selectedCoordinates.y,
      colorId: selectedColor.id,
    };

    try {
      axios.post(requestUrl, body, {
        withCredentials: true,
      });
    } catch (e) {
      console.error(e);
    }

    setSelectedColor(null);
    setCoords(null);
  };

  return (
    <DynamicButton
      color={selectedColor}
      disabled={disabled}
      onAction={handlePixelRequest}
    >
      {isSelected ? "Place pixel" : "Select a pixel"}
      <CoordinateLabel>
        {isSelected ? `(${x},\u00A0${y})` : undefined}
      </CoordinateLabel>
    </DynamicButton>
  );
}
