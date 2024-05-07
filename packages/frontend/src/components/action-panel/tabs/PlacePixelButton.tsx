import { styled } from "@mui/material";

import { PaletteColor, Point } from "@blurple-canvas-web/types";

import { Button as ButtonBase } from "@/components";

const DynamicButton = styled(ButtonBase, {
  shouldForwardProp: (prop) => prop !== "backgroundColorStr",
})<{ backgroundColorStr?: string }>`
  --dynamic-bg-color: ${({ backgroundColorStr = "var(--discord-blurple)" }) =>
    backgroundColorStr};

  &:not(:disabled) {
    &:hover {
      background-color: var(--dynamic-bg-color);
      border-color: oklch(var(--discord-white-oklch) / 36%);
    }
    &:active {
      border-color: oklch(var(--discord-white-oklch) / 72%);
      font-weight: bolder;
    }
  }
`;

const DynamicButtonContent = styled("span")`
  display: block flex;
  gap: 0.2rem;
  opacity: 95%;
  transition: font-weight var(--transition-duration-fast) ease;

  /*
   * Ensure contrast of button label against background. The color property
   * should match that of the background it sits against.
   *
   * From https://robinrendle.com/the-cascade/015-context-aware-colors
   */
  color: var(--dynamic-bg-color);
  filter: invert(1) grayscale(1) brightness(1.3) contrast(9000);
  mix-blend-mode: luminosity;
`;

export const CoordinateLabel = styled("span")`
  opacity: 0.6;
`;

type PlacePixelButtonProps = {
  color: PaletteColor | null;
  coordinates: Point;
  disabled?: boolean;
};

export default function PlacePixelButton({
  color,
  coordinates,
  disabled = false,

  ...props
}: PlacePixelButtonProps) {
  const rgba = color?.rgba;
  const rgb = rgba?.slice(0, 3).join(" ");
  const alphaFloat = rgba ? rgba[3] / 255 : undefined;

  const backgroundColorStr = color ? `rgb(${rgb} / ${alphaFloat})` : undefined;
  const { x, y } = coordinates; // TODO: Adjust coordinates by visual start coordinate offset (defined in canvas info)

  return (
    <DynamicButton
      backgroundColorStr={backgroundColorStr}
      disabled={disabled}
      {...props}
    >
      <DynamicButtonContent>
        Place pixel
        <CoordinateLabel>
          ({x},&nbsp;{y})
        </CoordinateLabel>
      </DynamicButtonContent>
    </DynamicButton>
  );
}
