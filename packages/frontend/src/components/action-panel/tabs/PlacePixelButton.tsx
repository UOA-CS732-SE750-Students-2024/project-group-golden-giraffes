"use client";

import { buttonClasses, css, styled } from "@mui/material";

import { PaletteColor, Point } from "@blurple-canvas-web/types";

import { Button as ButtonBase } from "@/components/Button";

const DynamicButton = styled(ButtonBase, {
  shouldForwardProp: (prop) => prop !== "backgroundColorStr",
})<{ backgroundColorStr?: string }>`
  :not(.${buttonClasses.disabled}) {
    --dynamic-bg-color: var(--discord-blurple);
    background-color: var(--dynamic-bg-color);

    :hover,
    :focus,
    :focus-visible {
      ${({ backgroundColorStr }) =>
        backgroundColorStr &&
        css`
          --dynamic-bg-color: ${backgroundColorStr};
        `}
      border-color: oklch(var(--discord-white-oklch) / 36%);
      font-weight: 600;
    }
  }

  &:active {
    border-color: oklch(var(--discord-white-oklch) / 72%);
    font-weight: 450;
  }
`;

const DynamicButtonContent = styled("span")`
  display: block flex;
  gap: 0.25rem;
  opacity: 95%;
  transition:
    color var(--transition-duration-fast) ease,
    filter var(--transition-duration-fast) ease,
    font-weight var(--transition-duration-fast) ease;

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

interface PlacePixelButtonProps {
  color: PaletteColor | null;
  coordinates: Point;
  disabled?: boolean;
}

export default function PlacePixelButton({
  color,
  coordinates,
  disabled = false,
  ...props
}: PlacePixelButtonProps) {
  const rgba = color?.rgba;
  const rgb = rgba?.slice(0, 3).join(" ");

  const backgroundColorStr = color ? `rgb(${rgb})` : undefined;
  const { x, y } = coordinates; // TODO: Adjust coordinates by visual start coordinate offset (defined in canvas info)

  return (
    <DynamicButton backgroundColorStr={backgroundColorStr} {...props}>
      <DynamicButtonContent>
        Place pixel
        <CoordinateLabel>
          ({x},&nbsp;{y})
        </CoordinateLabel>
      </DynamicButtonContent>
    </DynamicButton>
  );
}
