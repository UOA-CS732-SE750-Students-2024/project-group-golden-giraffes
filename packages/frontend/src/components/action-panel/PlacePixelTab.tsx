import { usePalette } from "@/hooks";
import { Palette } from "@blurple-canvas-web/types";
import { colorToSwatch } from "../color/Color";
import { ActionMenu, Heading } from "./ActionPanel";

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

  return (
    <ActionMenu>
      <Heading>Main colors</Heading>
      {mainColors.map((color) => colorToSwatch({ color }))}
      <Heading>Partner colors</Heading>
      {partnerColors.map((color) => colorToSwatch({ color }))}
    </ActionMenu>
  );
}
