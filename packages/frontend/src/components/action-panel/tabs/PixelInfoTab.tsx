import { styled } from "@mui/material";

import { PixelHistoryRecord } from "@blurple-canvas-web/types";

import { useSelectedPixelContext } from "@/contexts/SelectedPixelContext";
import { usePixelHistory } from "@/hooks";
import { Heading } from "../ActionPanel";
import { ActionPanelTabBody } from "./ActionPanelTabBody";
import CoordinatesCard from "./CoordinatesCard";
import PixelHistoryListItem from "./PixelHistoryListItem";

const HistoryList = styled("div")`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

interface PixelHistoryProps {
  isLoading: boolean;
  history: PixelHistoryRecord[];
}

const PixelHistory = ({ isLoading, history }: PixelHistoryProps) => {
  // TODO: Replace with skeleton
  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (history.length === 0) {
    return <p>No pixel history</p>;
  }

  const currentPixelInfo = history[0]; // undefined if out of index
  const pastPixelHistory = history.slice(1); // [] if out of index

  return (
    <>
      <PixelHistoryListItem record={currentPixelInfo} />
      {pastPixelHistory.length !== 0 && (
        <>
          <Heading>Paint history</Heading>
          <HistoryList>
            {pastPixelHistory.map((history: PixelHistoryRecord) => (
              <PixelHistoryListItem key={history.id} record={history} />
            ))}
          </HistoryList>
        </>
      )}
    </>
  );
};

interface PixelInfoTabProps {
  canvasId: number;
  active?: boolean;
}

export default function PixelInfoTab({
  active = false,
  canvasId,
}: PixelInfoTabProps) {
  const { coords, adjustedCoords } = useSelectedPixelContext();
  const { data: pixelHistory = [], isLoading } = usePixelHistory(
    canvasId,
    coords,
  );

  return (
    <ActionPanelTabBody active={active}>
      {adjustedCoords ?
        <div>
          <CoordinatesCard coordinates={adjustedCoords} />
          <PixelHistory history={pixelHistory} isLoading={isLoading} />
        </div>
      : <p>No selected pixel</p>}
    </ActionPanelTabBody>
  );
}
