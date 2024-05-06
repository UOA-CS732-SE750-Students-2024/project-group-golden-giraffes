"use client";

import config from "@/config";
import { usePalette } from "@/hooks/queries";
import { Palette, PixelHistory } from "@blurple-canvas-web/types";
import { styled } from "@mui/material";
import Head from "next/head";
import { useEffect, useState } from "react";
import { Color } from "../color/Color";
import { colorToSwatch } from "../color/Color";
import PixelInfoTab, { Coordinates, HistoryRecords } from "./PixelInfoTab";
import { HistoryRecord } from "./PixelInfoTab";

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

export const ActionMenu = styled("div")`
  background-color: var(--discord-legacy-dark-but-not-black);
  display: grid;
  gap: max(0.25rem, 2px);
  grid-template-columns: repeat(5, 1fr);
  padding: 1rem;
`;

export const Heading = styled("h2")`
  color: oklch(var(--discord-white-oklch) / 60%);
  font-weight: 600;
  font-size: 1rem;
  grid-column: 1 / -1;
  letter-spacing: 0.08em;
  margin-block-start: 1rem;
  text-transform: uppercase;
`;

const partitionPalette = (palette: Palette) => {
  const mainColors: Palette = [];
  const partnerColors: Palette = [];
  for (const color of palette) {
    (color.global ? mainColors : partnerColors).push(color);
  }

  return [mainColors, partnerColors];
};

export default function ActionPanel() {
  enum TabTypes {
    Look = "Look",
    Place = "Place",
    Zen = "Zen",
  }

  const [currentTab, setCurrentTab] = useState<TabTypes>(TabTypes.Place);

  const { data: palette = [], isLoading: colorsAreLoading } = usePalette();

  const [mainColors, partnerColors] = partitionPalette(palette);

  const [coordinates, setCoordinates] = useState<[number, number] | null>(null);

  const canvasId = 2023; // This is a placeholder value

  useEffect(() => {
    setCoordinates([0, 0]); // This is a placeholder value
  }, []);

  return (
    <>
      <TabBar>
        <Tab onClick={() => setCurrentTab(TabTypes.Look)}>Look</Tab>
        <Tab onClick={() => setCurrentTab(TabTypes.Place)}>Place</Tab>
        <ZenTab onClick={() => setCurrentTab(TabTypes.Zen)}>🧘</ZenTab>
      </TabBar>
      <Container>
        {currentTab === TabTypes.Look && (
          <PixelInfoTab coordinates={coordinates} canvasId={canvasId} />
        )}
        {currentTab === TabTypes.Place && (
          <ActionMenu>
            <Heading>Main colours</Heading>
            {mainColors.map((color) => colorToSwatch(color))}
            <Heading>Partner colours</Heading>
            {partnerColors.map((color) => colorToSwatch(color))}
          </ActionMenu>
        )}
      </Container>
    </>
  );
}
