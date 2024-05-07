"use client";

import { styled } from "@mui/material";

import { PaletteColor } from "@blurple-canvas-web/types";

interface ColorCodeChipProps {
  backgroundColor: PaletteColor;
  onClick?: () => void;
}

const Container = styled("code", {
  shouldForwardProp: (prop) => prop !== "backgroundColor",
})<ColorCodeChipProps>`
  background-color: oklch(var(--discord-white-oklch) / 12%);
  border-radius: 0.25rem;
  cursor: pointer;
  font-family: var(--font-monospace);
  font-size: 0.9rem;
  padding: 0.25rem 0.5rem;
  transition: background-color var(--transition-duration-fast) ease;

  :hover {
    background-color: rgba(
      ${({ backgroundColor }) => backgroundColor.rgba.slice(0, 3).join(", ")},
      36%
    );
  }

  :active {
    background-color: rgba(
      ${({ backgroundColor }) => backgroundColor.rgba.slice(0, 3).join(", ")},
      6%
    );
  }
`;

export default function ColorCodeChip({
  color,
  onClick = () => {},
  ...props
}: {
  color: PaletteColor;
  onClick?: () => void;
}) {
  return (
    <Container backgroundColor={color} onClick={onClick} {...props}>
      {color.code}
    </Container>
  );
}
