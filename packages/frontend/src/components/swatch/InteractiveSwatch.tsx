import { styled } from "@mui/material";

import { StaticSwatchProps } from "./StaticSwatch";
import { SwatchBase } from "./SwatchBase";

const StyledSwatchBase = styled(SwatchBase)`
  cursor: pointer;
  border: 0.25rem solid oklch(var(--discord-white-oklch) / 15%);
  transition:
    opacity var(--transition-duration-fast) ease,
    outline-width var(--transition-duration-fast) ease,
    border-color var(--transition-duration-fast) ease;

  :hover:not(.disabled, .selected) {
    opacity: 85%;
  }

  :focus,
  :focus-visible {
    outline: var(--focus-outline);
  }

  &.selected {
    border: 0.25rem solid var(--discord-white);
    background-clip: content-box;
    padding: 0.25rem;
  }
`;

type InteractiveSwatchProps = StaticSwatchProps & {
  onAction: () => void;
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

  const clickHandler = onAction;
  const keyUpHandler = (event: React.KeyboardEvent) => {
    if (event.key === "Enter" || event.key === " ") onAction();
  };

  return (
    <StyledSwatchBase
      aria-disabled={disabled}
      className={selected ? "selected" : undefined}
      colorString={`rgb(${rgb} / ${alphaFloat})`}
      onClick={clickHandler}
      onKeyUp={keyUpHandler}
      tabIndex={0}
    />
  );
}
