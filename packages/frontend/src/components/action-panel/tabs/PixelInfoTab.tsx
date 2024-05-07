import { PixelHistoryRecord, Point } from "@blurple-canvas-web/types";

import { usePixelHistory } from "@/hooks";
import { Heading } from "../ActionPanel";
import ActionPanelTab from "./ActionPanelTab";
import CoordinatesCard from "./CoordinatesCard";
import PixelHistoryListItem from "./PixelHistoryListItem";

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
      <CoordinatesCard coordinates={coordinates} />
      <div>
        <PixelHistoryListItem record={currentPixelInfo} />
        <Heading>Paint history</Heading>
        {pastPixelHistory.map((history: PixelHistoryRecord) => (
          <PixelHistoryListItem key={history.id} record={history} />
        ))}
      </div>
    </ActionPanelTab>
  );
}
