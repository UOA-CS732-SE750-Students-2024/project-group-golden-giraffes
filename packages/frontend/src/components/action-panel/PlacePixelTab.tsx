import { usePalette } from "@/hooks";
import { Palette, PaletteColor, Point } from "@blurple-canvas-web/types";
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

export const ButtonSeries = styled("div")`
  display: flex;
  gap: max(0.25rem, 2px);

  > * {
    flex: 1;
  }
`;

interface ButtonProps {
  backgroundColor?: string;
  disabled?: boolean;
  onClick: () => void;
}

export const Button = styled("div")<ButtonProps>`
  align-items: center;
  background-color: ${({ backgroundColor }) =>
    backgroundColor ? backgroundColor : "var(--discord-blurple)"};
  border: oklch(var(--discord-white-oklch) / 12%) 3px solid;
  border-radius: var(--card-border-radius);
  color: ${({ backgroundColor }) =>
    backgroundColor?.includes("255") ?
      "var(--discord-legacy-actually-black)"
    : "var(--discord-white)"};
  cursor: pointer;
  font-size: 1.3rem;
  font-weight: 600;
  gap: 0.5rem;
  grid-template-columns: auto 1fr;
  padding: 0.5rem 1rem;
  text-align: center;
  transition:
    background-color var(--transition-duration-medium) ease,
    border-color var(--transition-duration-medium) ease,
    color var(--transition-duration-medium) ease;
  user-select: none;

  ${({ disabled }) =>
    disabled &&
    `opacity: 0.6;
  cursor: not-allowed;
  `}

  ${({ disabled }) =>
    !disabled &&
    `&:hover {
      border-color: oklch(var(--discord-white-oklch) / 36%);
    }

    :active {
      border-color: oklch(var(--discord-white-oklch) / 72%);
    }`}
`;

export const TranslucentText = styled("span")<{ opacity: number }>`
  opacity: ${({ opacity }) => opacity};
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

interface PlacePixelTabProps {
  coordinates: Point;
  canvasId: number;
}

export default function PlacePixelTab({
  coordinates,
  canvasId,
}: PlacePixelTabProps) {
  const { data: palette = [], isLoading: colorsAreLoading } = usePalette();
  const [mainColors, partnerColors] = partitionPalette(palette);

  const [selectedColor, setSelectedColor] = useState<PaletteColor | null>(null);

  const rgba = selectedColor?.rgba;
  const rgb = rgba?.slice(0, 3).join(" ");
  const alphaFloat = rgba ? rgba[3] / 255 : undefined;

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
      <ButtonSeries>
        <Button
          backgroundColor={
            selectedColor ? `rgb(${rgb} / ${alphaFloat})` : undefined
          }
          // disabled={true}  << how to disable the button
          onClick={() => console.log("Place pixel")}
        >
          Paint it!{" "}
          <TranslucentText opacity={0.6}>
            ({coordinates.x}, {coordinates.y})
          </TranslucentText>
        </Button>
      </ButtonSeries>
    </ActionMenu>
  );
}
