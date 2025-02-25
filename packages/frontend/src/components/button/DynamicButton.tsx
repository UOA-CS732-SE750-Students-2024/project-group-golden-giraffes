"use client";

import { buttonClasses, css, styled } from "@mui/material";

import { PaletteColor } from "@blurple-canvas-web/types";

import { Button as ButtonBase } from "@/components/button";

const StyledAnchor = styled("a")`
  display: contents;
`;

const StyledButton = styled(ButtonBase, {
  shouldForwardProp: (prop) => prop !== "backgroundColorStr",
})<{ backgroundColorStr?: string }>`
  :not(.${buttonClasses.disabled}) {
    --dynamic-bg-color: var(--discord-blurple);
    background-color: var(--dynamic-bg-color);

    &:hover,
    &:focus-visible {
      ${({ backgroundColorStr }) =>
        backgroundColorStr &&
        css`
          --dynamic-bg-color: ${backgroundColorStr};
        `}
      border-color: oklch(from var(--discord-white) l c h / 36%);
      font-weight: 600;
    }
  }

  &:active {
    border-color: oklch(from var(--discord-white) l c h / 72%);
    font-weight: 450;
  }
`;

const DynamicButtonContent = styled("span")`
  display: block flex;
  gap: 0.25rem;
  opacity: 95%;
  transition: var(--transition-duration-fast) ease;
  transition-property: color filter font-weight;

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

interface DynamicButtonProps {
  children: React.ReactNode;
  color: PaletteColor | null;
  disabled?: boolean;
  onAction?: () => void;
}

export default function DynamicButton({
  children,
  color,
  disabled = false,
  onAction,
  ...props
}: DynamicButtonProps) {
  const rgba = color?.rgba;
  const rgb = rgba?.slice(0, 3).join(" ");

  const backgroundColorStr = color ? `rgb(${rgb})` : undefined;

  const clickHandler = onAction;
  const keyUpHandler = (event: React.KeyboardEvent) => {
    if (event.key === "Enter" || event.key === " ") {
      onAction?.();
    }
  };

  return (
    <StyledButton
      backgroundColorStr={backgroundColorStr}
      onClick={clickHandler}
      onKeyUp={keyUpHandler}
      {...props}
    >
      <DynamicButtonContent>{children}</DynamicButtonContent>
    </StyledButton>
  );
}

export function DynamicAnchorButton({
  children,
  href,
  ...props
}: DynamicButtonProps & { href: string }) {
  return (
    <StyledAnchor href={href} target="_blank" rel="noreferrer">
      <DynamicButton {...props}>{children}</DynamicButton>
    </StyledAnchor>
  );
}
