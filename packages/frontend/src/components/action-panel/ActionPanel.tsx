"use client";

import config from "@/config";
import { usePalette } from "@/hooks/queries";
import { Palette, PaletteColor, PixelHistory } from "@blurple-canvas-web/types";
import { css, styled } from "@mui/material";
import Head from "next/head";
import { useEffect, useState } from "react";
import { Color } from "../color/Color";

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

const ActionMenu = styled("div")`
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

const Coordinates = styled("p")`
  color: oklch(var(--discord-white-oklch) / 60%);
  font-size: 1.8rem;
  grid-column: 1 / -1;
  text-align: center;
  font-family: var(--font-monospace);
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(0, 1fr));
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

const HistoryRecords = styled("div")`
  display: grid;
  grid-column: 1 / -1;
  row-gap: 1.5rem;
`;

const Record = styled("div")`
  display: flex;
  gap: 1rem;
  justify-content: space-between;
  align-items: center;
  & > *:first-child {
    width: 3em;
  }
`;

const RecordInfo = styled("div")`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  flex: 1;
`;

const RecordAuthor = styled("span")`
  font-size: 1.3rem;
`;

const RecordColor = styled("div")`
  display: flex;
  gap: 0.5rem;
  align-items: center;
  opacity: 0.6;
`;

const RecordColorName = styled("span")`
  font-size: 1.2rem;
`;

const RecordColorCode = styled("span")`
  font-size: 0.9rem;
  font-family: var(--font-monospace);
  background-color: rgba(255, 255, 255, 0.12);
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
`;

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

const HistoryRecord = ({
  history,
  color,
}: {
  history: PixelHistory;
  color?: PaletteColor;
}) => {
  if (color) {
    return (
      <Record>
        {colorToSwatch(color, true)}
        <RecordInfo>
          <RecordAuthor>{history.userId}</RecordAuthor>
          <RecordColor>
            <RecordColorName>{color.name}</RecordColorName>
            <RecordColorCode>{color.code}</RecordColorCode>
          </RecordColor>
        </RecordInfo>
      </Record>
    );
  }
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

  const [coordinate, setCoordinate] = useState<[number, number] | null>(null);
  const [pixelHistory, setPixelHistory] = useState<PixelHistory[] | null>(null);

  const canvasId = 2023; // This is a placeholder value

  useEffect(() => {
    const fetchUserStats = async () => {
      if (coordinate) {
        const response = await fetch(
          `${config.apiUrl}/api/v1/canvas/${canvasId}/pixel/history?x=${coordinate[0]}&y=${coordinate[1]}`,
        );
        const data = await response.json();
        setPixelHistory(data);
      } else {
        setPixelHistory(null);
      }
    };

    fetchUserStats();
  }, [coordinate]);

  useEffect(() => {
    setCoordinate([0, 0]); // This is a placeholder value
  }, []);

  return (
    <>
      <TabBar>
        <Tab onClick={() => setCurrentTab("Look")}>Look</Tab>
        <Tab onClick={() => setCurrentTab("Place")}>Place</Tab>
        <ZenTab onClick={() => setCurrentTab("Zen")}>🧘</ZenTab>
      </TabBar>
      <Container>
        {currentTab === "Look" && (
          <ActionMenu>
            {coordinate && (
              <>
                <Coordinates>
                  <span>x: {coordinate[0]}</span>
                  <span>y: {coordinate[1]}</span>
                </Coordinates>
                {Array.isArray(pixelHistory) && ( // To be redesigned later
                  <HistoryRecord
                    history={pixelHistory[0]}
                    color={
                      palette.find(
                        (color) => color.id === pixelHistory[0].colorId,
                      ) || undefined
                    }
                  />
                )}
                <Heading>Paint History</Heading>
                {Array.isArray(pixelHistory) && pixelHistory.length > 1 && (
                  <HistoryRecords>
                    {pixelHistory.slice(1).map((history, index) => (
                      <HistoryRecord
                        key={`${index}-${history.userId}`}
                        history={history}
                        color={
                          palette.find(
                            (color) => color.id === history.colorId,
                          ) || undefined
                        }
                      />
                    ))}
                  </HistoryRecords>
                )}
              </>
            )}
            {!coordinate && <p>Click on a pixel to see its history.</p>}
          </ActionMenu>
        )}
        {currentTab === "Place" && (
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
