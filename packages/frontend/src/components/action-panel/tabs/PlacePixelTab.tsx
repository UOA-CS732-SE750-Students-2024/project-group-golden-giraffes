import { styled } from "@mui/material";

import { DiscordUserProfile, Palette } from "@blurple-canvas-web/types";

import config from "@/config";
import {
  useActiveCanvasContext,
  useAuthContext,
  useSelectedColorContext,
  useSelectedPixelLocationContext,
} from "@/contexts";
import { usePalette } from "@/hooks";
import axios from "axios";
import { DynamicAnchorButton, DynamicButton } from "../../button";
import { InteractiveSwatch } from "../../swatch";
import { Heading } from "../ActionPanel";
import { ActionPanelTabBody } from "./ActionPanelTabBody";
import BotCommandCard from "./BotCommandCard";
import ColorInfoCard from "./SelectedColorInfoCard";

import Cooldown from "@/components/button/Cooldown";

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

function userWithinServer(user: DiscordUserProfile, serverId: string) {
  return false;
  // const guildIds = decodeUserGuildsBase64(user);
  // return guildIds.some((guildId) => guildId === serverId);
}

interface PlacePixelTabProps {
  eventId: number | null;
  active?: boolean;
}

export default function PlacePixelTab({
  active = false,
  eventId,
}: PlacePixelTabProps) {
  const { data: palette = [], isLoading: paletteIsLoading } = usePalette(
    eventId ?? undefined,
  );
  const [mainColors, partnerColors] = partitionPalette(palette);

  const { color: selectedColor, setColor: setSelectedColor } =
    useSelectedColorContext();

  const { user } = useAuthContext();
  const { canvas } = useActiveCanvasContext();

  const { adjustedCoords, setCoords } = useSelectedPixelLocationContext();

  const inviteSlug = selectedColor?.invite;
  const hasInvite = !!inviteSlug;
  const serverInvite =
    hasInvite ? `https://discord.gg/${inviteSlug}` : undefined;

  const selectedCoordinates = adjustedCoords;
  const x = selectedCoordinates?.x;
  const y = selectedCoordinates?.y;

  const webPlacingEnabled = canvas.webPlacingEnabled;

  const canPlacePixel =
    webPlacingEnabled &&
    selectedColor &&
    user &&
    (selectedColor.global || userWithinServer(user, selectedColor.guildId));

  const readOnly = canvas.isLocked;

  const isJoinServerShown =
    (!canPlacePixel || readOnly) && !selectedColor?.global && serverInvite;

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
      {canPlacePixel && !readOnly && (
        <DynamicButton
          color={selectedColor}
          disabled={paletteIsLoading || !selectedColor}
          onAction={handlePixelRequest}
        >
          {isSelected ? "Place pixel" : "Select a pixel"}
          <CoordinateLabel>
            {isSelected ? `(${x},\u00A0${y})` : undefined}
          </CoordinateLabel>
        </DynamicButton>
      )}
      {isJoinServerShown && (
        <DynamicAnchorButton color={selectedColor} href={serverInvite}>
          Join {selectedColor?.guildName ?? "server"}
        </DynamicAnchorButton>
      )}
      {!readOnly && isSelected && (
        <BotCommandCard
          color={selectedColor}
          coordinates={selectedCoordinates}
        />
      )}
      <Cooldown />
    </ActionPanelTabBody>
  );
}
