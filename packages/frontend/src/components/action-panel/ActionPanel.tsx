"use client";

import { usePalette } from "@/hooks/queries";
import { Palette, PaletteColor } from "@blurple-canvas-web/types";
import { css, styled } from "@mui/material";
import { useState } from "react";

const Container = styled("div")`
  background-color: var(--discord-legacy-not-quite-black);
  border-radius: var(--card-border-radius);
  border: var(--card-border);
  gap: 0.5rem;
  height: 100%;
  padding: 1rem;
  width: 100%;
`;

const TabBar = styled("ul")`
  display: flex;
  gap: 0.25rem;
  list-style-type: none;

  /*
   * Workaround for accessibility issue with VoiceOver.
   * See https://gerardkcohen.me/writing/2017/voiceover-list-style-type.html
   */
  li::before {
    content: "\\200B"; /* zero-width space */
  }
`;

const Tab = styled("li")`
  background-color: var(--discord-legacy-not-quite-black);
  border-radius: var(--card-border-radius);
  cursor: pointer;
  display: block flex;
  font-size: 1.5rem;
  font-weight: 500;
  padding: 0.5rem 1.25rem;
  place-items: center;
  touch-action: manipulation;
  transition:
    background-color var(--transition-duration-fast) ease,
    color var(--transition-duration-fast) ease,
    outline var(--transition-duration-fast) ease;
  user-select: none;

  :hover {
    background-color: var(--discord-legacy-greyple);
  }

  :focus,
  :focus-visible {
    outline: var(--focus-outline);
  }

  :active {
    background-color: var(--discord-yellow);
    color: var(--discord-black);
  }
`;

const ZenTab = styled(Tab)`
  margin-inline-start: auto;
`;

const ColorPicker = styled("div")`
  background-color: var(--discord-legacy-dark-but-not-black);
  display: grid;
  gap: max(0.25rem, 2px);
  grid-template-columns: repeat(5, 1fr);
  padding: 1rem;
`;

const Heading = styled("h2")`
  color: oklch(var(--discord-white-oklch) / 60%);
  font-weight: 600;
  font-size: 1rem;
  grid-column: 1 / -1;
  letter-spacing: 0.08em;
  margin-block-start: 1rem;
  text-transform: uppercase;
`;

const ColorfulDiv = styled("div", {
  shouldForwardProp: (prop) => prop !== "colorString",
})<{ colorString: string }>(
  ({ colorString }) => css`
    aspect-ratio: 1;
    background-color: ${colorString};
    border-radius: var(--card-border-radius);
    border: oklch(var(--discord-white-oklch) / 30%) 3px solid;
    gap: 0.25rem;
  `,
);

interface SwatchProps {
  rgba: PaletteColor["rgba"];
  selected?: boolean;
}

const Swatch = ({ rgba, selected = false }: SwatchProps) => {
  // Convert [255, 255, 255, 255] to rgb(255 255 255 / 1.0)
  const rgb = rgba.slice(0, 3).join(" ");
  const alphaFloat = rgba[3] / 255;

  return (
    <ColorfulDiv
      className={selected ? "selected" : undefined}
      colorString={`rgb(${rgb} / ${alphaFloat})`}
    />
  );
};

const partitionPalette = (palette: Palette) => {
  const mainColors: Palette = [];
  const partnerColors: Palette = [];
  for (const color of palette) {
    (color.global ? mainColors : partnerColors).push(color);
  }

  return [mainColors, partnerColors];
};

const colorToSwatch = (color: PaletteColor, selected = false) => {
  return <Swatch key={color.code} rgba={color.rgba} selected={selected} />;
};

export default function ActionPanel() {
  const [currentTab, setCurrentTab] = useState<string>("Place");

  const { data: palette = [], isLoading: colorsAreLoading } = usePalette();

  const [mainColors, partnerColors] = partitionPalette(palette);

  return (
    <>
      <TabBar>
        <Tab onClick={() => setCurrentTab("Look")}>Look</Tab>
        <Tab onClick={() => setCurrentTab("Place")}>Place</Tab>
        <ZenTab onClick={() => setCurrentTab("Zen")}>🧘</ZenTab>
      </TabBar>
      <Container>
        {currentTab === "Place" && (
          <ColorPicker>
            <Heading>Main colours</Heading>
            {mainColors.map((color) => colorToSwatch(color))}
            <Heading>Partner colours</Heading>
            {partnerColors.map((color) => colorToSwatch(color))}
          </ColorPicker>
        )}
      </Container>
    </>
  );
}
