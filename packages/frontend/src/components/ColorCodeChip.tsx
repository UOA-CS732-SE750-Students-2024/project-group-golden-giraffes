"use client";

import { styled } from "@mui/material";

import { PaletteColor } from "@blurple-canvas-web/types";

const Container = styled("code")`
  background-color: oklch(var(--discord-white-oklch) / 12%);
  border-radius: 0.25rem;
  cursor: pointer;
  font-family: var(--font-monospace);
  font-size: 0.9rem;
  padding: 0.25rem 0.5rem;
  transition: background-color var(--transition-duration-fast) ease;

  :hover {
    background-color: oklch(var(--discord-white-oklch) / 20%);
  }

  :active {
    background-color: oklch(var(--discord-white-oklch) / 6%);
  }
`;

export default function ColorCodeChip({
  colorCode,
  ...props
}: {
  colorCode: PaletteColor["code"];
}) {
  return <Container {...props}>{colorCode}</Container>;
}
