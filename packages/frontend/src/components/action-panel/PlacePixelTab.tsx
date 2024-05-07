import { usePalette } from "@/hooks";
import { Palette, PaletteColor } from "@blurple-canvas-web/types";
import { styled } from "@mui/material";
import { useState } from "react";
import { colorToSwatch } from "../color/Color";
import { ActionMenu, Heading } from "./ActionPanel";
import ColorInfoCard from "./SelectedColorInfoCard";

const SelectedColorInfo = styled("div")`
  grid-column: 1 / -1;
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
  const { data: palette = [], isLoading: colorsAreLoading } = usePalette();
  const [mainColors, partnerColors] = partitionPalette(palette);

  const [selectedColor, setSelectedColor] = useState<PaletteColor | null>(null);

  return (
    <ActionMenu>
      <div>
        <Heading>Main colors</Heading>
        {/* {mainColors.map((color) =>
          colorToSwatch({
            color,
            selected: color === selectedColor,
            onClick: () =>
              color !== selectedColor ?
                setSelectedColor(color)
              : setSelectedColor(null),
          }),
        )} */}
        <Heading>Partner colors</Heading>
        {partnerColors.map((color) =>
          colorToSwatch({
            color,
            selected: color === selectedColor,
            onClick: () =>
              color !== selectedColor ?
                setSelectedColor(color)
              : setSelectedColor(null),
          }),
        )}
      </div>

      <ColorInfoCard color={selectedColor} />
    </ActionMenu>
  );
}
