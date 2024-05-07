import { usePalette } from "@/hooks";
import { Palette, PaletteColor } from "@blurple-canvas-web/types";
import { styled } from "@mui/material";
import { useState } from "react";

import { InteractiveSwatch } from "../../swatch";
import { Heading } from "../ActionPanel";
import ActionPanelTab from "./ActionPanelTab";
import ColorInfoCard from "./SelectedColorInfoCard";

const ColorPicker = styled("div")`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 0.25rem;
`;

export const partitionPalette = (palette: Palette) => {
  const mainColors: Palette = [];
  const partnerColors: Palette = [];
  for (const color of palette) {
    (color.global ? mainColors : partnerColors).push(color);
  }

  return [mainColors, partnerColors];
};

export default function PlacePixelTab() {
  const { data: palette = [] } = usePalette();
  const [mainColors, partnerColors] = partitionPalette(palette);

  const [selectedColor, setSelectedColor] = useState<PaletteColor | null>(null);

  return (
    <ActionPanelTab>
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
    </ActionPanelTab>
  );
}
