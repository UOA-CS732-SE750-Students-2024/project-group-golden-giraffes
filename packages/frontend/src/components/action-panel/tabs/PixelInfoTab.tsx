import { styled } from "@mui/material";

import { PixelHistoryRecord, Point } from "@blurple-canvas-web/types";

import { usePixelHistory } from "@/hooks";
import { ActionMenu, Heading } from "../ActionPanel";
import CoordinatesCard from "./CoordinatesCard";
import HistoryRecordComponent from "./PixelHistoryListItem";

const StyledCoordinatesCard = styled(CoordinatesCard)`
  grid-column: 1 / -1;
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
    <ActionMenu>
      <StyledCoordinatesCard coordinates={coordinates} />
      <div>
        <HistoryRecordComponent record={currentPixelInfo} />
        <Heading>Paint history</Heading>
        {pastPixelHistory.map((history: PixelHistoryRecord) => (
          <HistoryRecordComponent key={history.id} record={history} />
        ))}
      </div>
    </ActionMenu>
  );
}
