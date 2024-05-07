"use client";
import { PaletteColor } from "@blurple-canvas-web/types";
import { css, styled } from "@mui/material";
import { Check } from "lucide-react";
import React from "react";

export const ColorfulDiv = styled("div", {
  shouldForwardProp: (prop) => prop !== "colorString" && prop !== "size",
})<{ colorString: string; size?: number }>(
  ({ colorString, size }) => css`
    aspect-ratio: 1;
    background-color: ${colorString};
    border-radius: var(--card-border-radius);
    border: oklch(var(--discord-white-oklch) / 30%) 3px solid;
    gap: 0.25rem;
    position: relative;
    ${size && `inline-size: ${size}em;`}
    transition: border-color 0.2s, background-color 0.2s, opacity 0.2s;

    &.selected,
    &.active {
      border-color: var(--discord-white-oklch);
    }

    &.selected {
      ::after {
        opacity: 1;
      }
    }

    &::after {
      background-color: white;
      border-radius: var(--card-border-radius) 0 0 0;
      bottom: 0;
      content: "";
      height: calc(33.33%);
      opacity: 0;
      position: absolute;
      right: 0;
      transition: opacity 0.2s;
      width: calc(33.33%);
    }

    > svg {
      bottom: 0;
      color: ${colorString};
      opacity: 0;
      position: absolute;
      right: 0;
      transform: translate(
        0%,
        15%
      ); // couldn't figure out how to do this without hardcoding, help?
      transition: opacity 0.2s;
      width: calc(33.33%);
      z-index: 10;

      &.selected {
        opacity: 1;
      }
    }
  `,
);

export const ColorContainer = styled("div")`
  align-items: center;
  display: flex;
  gap: 0.5rem;
`;

export const ColorName = styled("span")`
  font-size: 1.2rem;
`;

export const ColorCode = styled("span")`
  background-color: rgba(255, 255, 255, 0.12);
  border-radius: 0.25rem;
  font-family: var(--font-monospace);
  font-size: 0.9rem;
  padding: 0.25rem 0.5rem;
  transition: background-color 0.2s;
  :hover {
    background-color: rgba(255, 255, 255, 0.24);
    cursor: pointer;
  }
  :active {
    background-color: rgba(255, 255, 255, 0.36);
  }
`;

interface SwatchProps {
  rgba: PaletteColor["rgba"];
  active?: boolean;
  selected?: boolean;
  size?: number;
}

export const Swatch = ({
  rgba,
  active = false,
  selected = false,
  size,
  onClick,
}: SwatchProps & { onClick?: () => void }) => {
  // Convert [255, 255, 255, 255] to rgb(255 255 255 / 1.0)
  const rgb = rgba.slice(0, 3).join(" ");
  const alphaFloat = rgba[3] / 255;

  return (
    <>
      <ColorfulDiv
        className={
          selected ? "selected"
          : active ?
            "active"
          : undefined
        }
        colorString={`rgb(${rgb} / ${alphaFloat})`}
        size={size}
        onClick={onClick}
      >
        <Check
          style={{ strokeWidth: "3px" }}
          className={selected ? "selected" : undefined}
        />
      </ColorfulDiv>
    </>
  );
};

interface ColorToSwatchProps {
  color: PaletteColor;
  active?: boolean;
  selected?: boolean;
  size?: number;
}

export const colorToSwatch = ({
  color,
  active = false,
  selected = false,
  size,
  onClick,
}: ColorToSwatchProps & { onClick?: () => void }) => {
  return (
    <Swatch
      key={color.code}
      rgba={color.rgba}
      active={active}
      selected={selected}
      size={size}
      onClick={onClick}
    />
  );
};

interface ColorProps {
  color: PaletteColor;
  displaySwatch?: boolean;
  displayName?: boolean;
  displayCode?: boolean;
}

export const PaletteColorRecord = ({
  color,
  displaySwatch = true,
  displayName = true,
  displayCode = true,
}: ColorProps) => {
  return (
    <ColorContainer className="colorRecord">
      {displaySwatch && colorToSwatch({ color, size: 2 })}
      {displayName && <ColorName className="colorName">{color.name}</ColorName>}
      {displayCode && (
        <ColorCode
          className="colorCode"
          onClick={() => {
            navigator.clipboard.writeText(color.code);
          }}
        >
          {color.code}
        </ColorCode>
      )}
    </ColorContainer>
  );
};
