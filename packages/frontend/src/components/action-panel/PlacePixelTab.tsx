import { usePalette } from "@/hooks";
import { Palette, PaletteColor } from "@blurple-canvas-web/types";
import { styled } from "@mui/material";
import { useState } from "react";
import { PaletteColorRecord, colorToSwatch } from "../color/Color";
import { ActionMenu, ActionMenuBlock, Heading } from "./ActionPanel";

const ColorDescription = styled("div")`
  grid-column: 1 / -1;
  padding: 1rem 0;

  > .colorRecord {
    justify-content: space-between;
  }

  * > .colorName {
    font-weight: 900;
    font-size: 1.5rem;
  }

  * > .colorCode {
    font-size: 1.2rem;
    justify-self: flex-end;
  }
`;

const NoColorSelectedMessage = styled("p")`
  color: var(--discord-white);
  font-size: 1.5rem;
  font-weight: 900;
  margin: 0;
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
      <ActionMenuBlock>
        <Heading>Main colors</Heading>
        {mainColors.map((color) =>
          colorToSwatch({
            color,
            selected: color === selectedColor,
            onClick: () =>
              color !== selectedColor ?
                setSelectedColor(color)
              : setSelectedColor(null),
          }),
        )}
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
      </ActionMenuBlock>
      <ActionMenuBlock>
        <ColorDescription>
          {selectedColor && (
            <PaletteColorRecord color={selectedColor} displaySwatch={false} />
          )}
          {!selectedColor && (
            <NoColorSelectedMessage>No color selected</NoColorSelectedMessage>
          )}
        </ColorDescription>
      </ActionMenuBlock>
    </ActionMenu>
  );
}
