import config from "@/config";
import { usePalette } from "@/hooks";
import { PaletteColor, PixelHistory } from "@blurple-canvas-web/types";
import { styled } from "@mui/material";
import { useEffect, useState } from "react";
import { colorToSwatch } from "../color/Color";
import { ActionMenu, Heading } from "./ActionPanel";

export const Coordinates = styled("p")`
  color: oklch(var(--discord-white-oklch) / 60%);
  font-size: 1.8rem;
  grid-column: 1 / -1;
  text-align: center;
  font-family: var(--font-monospace);
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(0, 1fr));
`;
export const HistoryRecords = styled("div")`
  display: grid;
  grid-column: 1 / -1;
  row-gap: 1.5rem;
`;
export const Record = styled("div")`
  display: flex;
  gap: 1rem;
  justify-content: space-between;
  align-items: center;
  & > *:first-child {
    width: 3em;
  }
`;
export const RecordInfo = styled("div")`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  flex: 1;
`;
export const RecordAuthor = styled("span")`
  font-size: 1.3rem;
`;
export const RecordColor = styled("div")`
  display: flex;
  gap: 0.5rem;
  align-items: center;
  opacity: 0.6;
`;
export const RecordColorName = styled("span")`
  font-size: 1.2rem;
`;
export const RecordColorCode = styled("span")`
  font-size: 0.9rem;
  font-family: var(--font-monospace);
  background-color: rgba(255, 255, 255, 0.12);
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
`;
export const HistoryRecord = ({
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

export default function PixelInfoTab({
  coordinates,
  canvasId,
}: {
  coordinates: [number, number] | null;
  canvasId: number;
}) {
  const { data: palette = [], isLoading: colorsAreLoading } = usePalette();

  const [pixelHistory, setPixelHistory] = useState<PixelHistory[] | null>(null);

  useEffect(() => {
    const fetchUserStats = async () => {
      if (coordinates) {
        const response = await fetch(
          `${config.apiUrl}/api/v1/canvas/${canvasId}/pixel/history?x=${coordinates[0]}&y=${coordinates[1]}`,
        );
        const data = await response.json();
        setPixelHistory(data);
      } else {
        setPixelHistory(null);
      }
    };

    fetchUserStats();
  }, [coordinates, canvasId]);

  const [currentPixelHistory, setCurrentPixelHistory] =
    useState<PixelHistory | null>(null);
  const [pastPixelHistory, setPastPixelHistory] = useState<PixelHistory[]>([]);
  useEffect(() => {
    console.log(pixelHistory);
    setCurrentPixelHistory(pixelHistory?.[0] || null);
    setPastPixelHistory(pixelHistory?.slice(1) || []);
  }, [pixelHistory]);

  return (
    <>
      <ActionMenu>
        {coordinates && (
          <>
            <Coordinates>
              <span>x: {coordinates[0]}</span>
              <span>y: {coordinates[1]}</span>
            </Coordinates>
            {currentPixelHistory && ( // To be redesigned later
              <HistoryRecord
                history={currentPixelHistory}
                color={
                  palette.find(
                    (color) => color.id === currentPixelHistory.colorId,
                  ) ?? undefined
                }
              />
            )}
            <Heading>Paint History</Heading>
            {pastPixelHistory && (
              <HistoryRecords>
                {pastPixelHistory.map((history) => (
                  <HistoryRecord
                    key={history.id}
                    history={history}
                    color={
                      palette.find((color) => color.id === history.colorId) ||
                      undefined
                    }
                  />
                ))}
              </HistoryRecords>
            )}
          </>
        )}
        {!coordinates && <p>Click on a pixel to see its history.</p>}
      </ActionMenu>
    </>
  );
}
