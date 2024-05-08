import { styled } from "@mui/material";

import { PixelHistoryRecord, Point } from "@blurple-canvas-web/types";

import { usePixelHistory } from "@/hooks";
import { Heading } from "../ActionPanel";
import { ActionPanelTabBody } from "./ActionPanelTabBody";
import CoordinatesCard from "./CoordinatesCard";
import PixelHistoryListItem from "./PixelHistoryListItem";

const TEMP_COORDS = { x: 1, y: 1 } as Point;

const HistoryList = styled("div")`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

interface PixelInfoTabProps {
  canvasId: number;
}

export default function PixelInfoTab({
  canvasId,
  ...props
}: PixelInfoTabProps) {
  const { data: pixelHistory = [] } = usePixelHistory(canvasId, TEMP_COORDS);

  const currentPixelInfo = pixelHistory[1]; // undefined if out of index
  const pastPixelHistory = pixelHistory.slice(1); // [] if out of index

  // Do this ⬇️ to cancel history query
  // queryClient.cancelQueries({
  //   queryKey: ["pixelHistory", canvasId, coordinates],
  // });

  return (
    <ActionPanelTabBody {...props}>
      <div>
        <CoordinatesCard coordinates={TEMP_COORDS} />
        <PixelHistoryListItem record={currentPixelInfo} />
        <Heading>Paint history</Heading>
        <HistoryList>
          {pastPixelHistory.map((history: PixelHistoryRecord) => (
            <PixelHistoryListItem key={history.id} record={history} />
          ))}
        </HistoryList>
      </div>
    </ActionPanelTabBody>
  );
}
