import { styled } from "@mui/material";

import { PixelHistoryRecord, Point } from "@blurple-canvas-web/types";

import { usePixelHistory } from "@/hooks";
import { Heading } from "../ActionPanel";
import { ActionPanelTab } from "./ActionPanelTab";
import CoordinatesCard from "./CoordinatesCard";
import PixelHistoryListItem from "./PixelHistoryListItem";

const HistoryList = styled("div")`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

interface PixelInfoTabProps {
  coordinates: Point;
  canvasId: number;
}

export default function PixelInfoTab({
  coordinates,
  canvasId,
}: PixelInfoTabProps) {
  const { data: pixelHistory = [] } = usePixelHistory(canvasId, coordinates);

  const currentPixelInfo = pixelHistory[1]; // undefined if out of index
  const pastPixelHistory = pixelHistory.slice(1); // [] if out of index

  // Do this ⬇️ to cancel history query
  // queryClient.cancelQueries({
  //   queryKey: ["pixelHistory", canvasId, coordinates],
  // });

  return (
    <ActionPanelTab>
      <div>
        <CoordinatesCard coordinates={coordinates} />
        <PixelHistoryListItem record={currentPixelInfo} />
        <Heading>Paint history</Heading>
        <HistoryList>
          {pastPixelHistory.map((history: PixelHistoryRecord) => (
            <PixelHistoryListItem key={history.id} record={history} />
          ))}
        </HistoryList>
      </div>
    </ActionPanelTab>
  );
}
