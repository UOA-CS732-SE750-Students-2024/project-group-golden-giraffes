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

  :focus,
  :focus-visible,
  :hover {
    background-color: oklch(var(--discord-white-oklch) / 20%);
  }

  :focus,
  :focus-visible {
    outline: var(--focus-outline);
  }

  :active {
    background-color: oklch(var(--discord-white-oklch) / 6%);
  }
`;

const copyToClipBoard = (str: string) => navigator.clipboard.writeText(str);

export default function ColorCodeChip({
  colorCode,
  ...props
}: {
  colorCode: PaletteColor["code"];
}) {
  const clickHandler = () => copyToClipBoard(colorCode);
  const keyUpHandler = (event: React.KeyboardEvent) => {
    if (event.key === "Enter" || event.key === " ") copyToClipBoard(colorCode);
  };

  return (
    <Container
      onClick={clickHandler}
      onKeyUp={keyUpHandler}
      tabIndex={0}
      {...props}
    >
      {colorCode}
    </Container>
  );
}
