import { styled } from "@mui/material";

import { StaticSwatchProps } from "./StaticSwatch";
import { SwatchBase } from "./SwatchBase";

const StyledSwatchBase = styled(SwatchBase)`
  --width: 0.25rem;

  cursor: pointer;
  border: var(--width) solid oklch(var(--discord-white-oklch) / 15%);
  transition: opacity var(--transition-duration-fast) ease;

  :hover:not(.disabled, .selected) {
    opacity: 85%;
  }

  &.selected {
    border: calc(1.5 * var(--width)) solid var(--discord-legacy-not-quite-black);
    outline: var(--width) solid var(--discord-white);
    outline-offset: calc(-1 * var(--width));
  }
`;

type InteractiveSwatchProps = StaticSwatchProps & {
  onAction?: () => void;
  selected?: boolean;
  disabled?: boolean;
};

export function InteractiveSwatch({
  disabled = false,
  onAction,
  rgba,
  selected = false,
}: InteractiveSwatchProps) {
  // Convert [255, 255, 255, 255] to rgb(255 255 255 / 1.0)
  const rgb = rgba.slice(0, 3).join(" ");
  const alphaFloat = rgba[3] / 255;

  return (
    <StyledSwatchBase
      aria-disabled={disabled}
      className={selected ? "selected" : undefined}
      colorString={`rgb(${rgb} / ${alphaFloat})`}
      onClick={onAction}
      onKeyUp={onAction}
    />
  );
}
