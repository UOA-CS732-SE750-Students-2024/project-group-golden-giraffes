import { styled } from "@mui/material";

import { Palette } from "@blurple-canvas-web/types";

import {
  useSelectedColorContext,
  useSelectedPixelLocationContext,
} from "@/contexts";
import { usePalette } from "@/hooks";
import { InteractiveSwatch } from "../../swatch";
import { Heading } from "../ActionPanel";
import { ActionPanelTabBody } from "./ActionPanelTabBody";
import PlacePixelButton from "./PlacePixelButton";
import ColorInfoCard from "./SelectedColorInfoCard";

const ColorPicker = styled("div")`
  display: grid;
  gap: 0.25rem;
  grid-template-columns: repeat(5, 1fr);
`;

export const partitionPalette = (palette: Palette) => {
  const mainColors: Palette = [];
  const partnerColors: Palette = [];
  for (const color of palette) {
    (color.global ? mainColors : partnerColors).push(color);
  }

  return [mainColors, partnerColors];
};

export default function PlacePixelTab({
  active = false,
}: {
  active?: boolean;
}) {
  const { data: palette = [], isLoading: paletteIsLoading } = usePalette();
  const [mainColors, partnerColors] = partitionPalette(palette);

  const { color: selectedColor, setColor: setSelectedColor } =
    useSelectedColorContext();
  const { pixelPoint } = useSelectedPixelLocationContext();

  return (
    <ActionPanelTabBody active={active}>
      <ColorPicker>
        <Heading>Main colors</Heading>
        {mainColors.map((color) => (
          <InteractiveSwatch
            key={color.code}
            rgba={color.rgba}
            onAction={() => setSelectedColor(color)}
            selected={color === selectedColor}
          />
        ))}
        <Heading>Partner colors</Heading>
        {partnerColors.map((color) => (
          <InteractiveSwatch
            key={color.code}
            onAction={() => setSelectedColor(color)}
            rgba={color.rgba}
            selected={color === selectedColor}
          />
        ))}
      </ColorPicker>
      <ColorInfoCard color={selectedColor} />
      <PlacePixelButton
        color={selectedColor}
        coordinates={pixelPoint}
        disabled={paletteIsLoading || !selectedColor}
      />
    </ActionPanelTabBody>
  );
}
