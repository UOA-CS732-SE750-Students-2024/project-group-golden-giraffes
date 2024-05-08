import { styled } from "@mui/material";

import { Palette, Point } from "@blurple-canvas-web/types";

import {
  useSelectedColorContext,
  useSelectedPixelLocationContext,
} from "@/contexts";
import { usePalette } from "@/hooks";
import { DynamicAnchorButton, DynamicButton } from "../../button";
import { InteractiveSwatch } from "../../swatch";
import { Heading } from "../ActionPanel";
import { ActionPanelTabBody } from "./ActionPanelTabBody";
import BotCommandCard from "./BotCommandCard";
import ColorInfoCard from "./SelectedColorInfoCard";

const ColorPicker = styled("div")`
  display: grid;
  gap: 0.25rem;
  grid-template-columns: repeat(5, 1fr);
`;

export const CoordinateLabel = styled("span")`
  opacity: 0.6;
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

  const inviteSlug = selectedColor?.invite;
  const hasInvite = !!inviteSlug;
  const serverInvite =
    hasInvite ? `https://discord.gg/${inviteSlug}` : undefined;

  const selectedCoordinates = pixelPoint;
  const x = selectedCoordinates?.x;
  const y = selectedCoordinates?.y;

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
      <ColorInfoCard color={selectedColor} invite={serverInvite} />
      <DynamicButton
        color={selectedColor}
        disabled={paletteIsLoading || !selectedColor}
      >
        {selectedCoordinates && selectedColor ?
          "Place pixel"
        : "Select a pixel"}
        <CoordinateLabel>
          {selectedCoordinates && selectedColor ? `(${x},\u00A0${y})` /* Nonbreaking space */ : undefined}
        </CoordinateLabel>
      </DynamicButton>
      {!selectedColor?.global && serverInvite && (
        <DynamicAnchorButton color={selectedColor} href={serverInvite}>
          Join {selectedColor?.guildName ?? "server"}
        </DynamicAnchorButton>
      )}
      <BotCommandCard color={selectedColor} coordinates={selectedCoordinates} />
    </ActionPanelTabBody>
  );
}
