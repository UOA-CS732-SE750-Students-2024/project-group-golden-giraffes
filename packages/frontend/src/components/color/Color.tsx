"use client";

import { css, styled } from "@mui/material";
import React from "react";

import { PaletteColor } from "@blurple-canvas-web/types";
import { StaticSwatch } from "../swatch/StaticSwatch";

export const ColorfulDiv = styled("div", {
  shouldForwardProp: (prop) => prop !== "colorString",
})<{ colorString: string }>(
  ({ colorString }) => css`
    aspect-ratio: 1;
    background-color: ${colorString};
    border-radius: var(--card-border-radius);
  `,
);

export const ColorContainer = styled("div")`
  align-items: center;
  display: flex;
  gap: 0.5rem;
`;

export const ColorCode = styled("span")`
  background-color: rgba(255, 255, 255, 0.12);
  border-radius: 0.25rem;
  cursor: pointer;
  font-family: var(--font-monospace);
  font-size: 0.9rem;
  padding: 0.25rem 0.5rem;
  transition: background-color 0.2s;

  :hover {
    background-color: rgba(255, 255, 255, 0.24);
  }

  :active {
    background-color: rgba(255, 255, 255, 0.36);
  }
`;

export const colorToSwatch = (color: PaletteColor) => {
  return <StaticSwatch key={color.code} rgba={color.rgba} />;
};

interface ColorProps {
  color: PaletteColor;
  displaySwatch?: boolean;
  displayName?: boolean;
  displayCode?: boolean;
}

const copyColorCode = (color: PaletteColor) =>
  navigator.clipboard.writeText(color.code);

export const PaletteColorRecord = ({
  color,
  displaySwatch = true,
  displayName = true,
  displayCode = true,
}: ColorProps) => {
  return (
    <ColorContainer className="colorRecord">
      {displaySwatch && colorToSwatch(color)}
      {displayName && <p className="colorName">{color.name}</p>}
      {/* {displayCode && (
        <span onClick={copyColorCode} onKeyUp={copyColorCode}>
          {color.code}
        </span>
      )} */}
    </ColorContainer>
  );
};
