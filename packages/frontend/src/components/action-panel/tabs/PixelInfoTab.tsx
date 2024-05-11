import { Tooltip, styled } from "@mui/material";

import { PixelHistoryRecord } from "@blurple-canvas-web/types";

import { DynamicButton } from "@/components/button";
import { CoordinateLabel } from "@/components/button/PlacePixelButton";
import { useCanvasContext } from "@/contexts";
import { usePixelHistory } from "@/hooks";
import { useState } from "react";
import { Heading } from "../ActionPanel";
import { ScrollBlock, TabBlock } from "./ActionPanelTabBody";
import { ActionPanelTabBody } from "./ActionPanelTabBody";
import CoordinatesCard from "./CoordinatesCard";
import PixelHistoryListItem from "./PixelHistoryListItem";

const PixelInfoTabBlock = styled(TabBlock)`
  grid-template-rows: auto 1fr auto;
`;

const HistoryList = styled("div")`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

interface PixelHistoryProps {
  isLoading: boolean;
  history: PixelHistoryRecord[];
}

const PixelHistoryPast = ({ isLoading, history }: PixelHistoryProps) => {
  // TODO: Replace with skeleton
  if (isLoading) {
    return;
  }

  if (history.length === 0) {
    return;
  }

  const pastPixelHistory = history.slice(1); // [] if out of index

  return (
    <>
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

const PixelHistoryCurrent = ({ isLoading, history }: PixelHistoryProps) => {
  // TODO: Replace with skeleton
  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (history.length === 0) {
    return <p>No pixel history</p>;
  }

  const currentPixelInfo = history[0]; // undefined if out of index

  return <PixelHistoryListItem record={currentPixelInfo} />;
};

interface PixelInfoTabProps {
  active?: boolean;
  canvasId: number;
}

export default function PixelInfoTab({
  active = false,
  canvasId,
}: PixelInfoTabProps) {
  const { canvas, coords, adjustedCoords, zoom } = useCanvasContext();
  const { data: pixelHistory = [], isLoading } = usePixelHistory(
    canvasId,
    coords,
  );

  const coordsLink = `${canvas.frontEndUrl}?canvas=${canvas.id}&x=${adjustedCoords?.x}&y=${adjustedCoords?.y}&zoom=${zoom.toFixed(3)}`;

  const [open, setOpen] = useState(false);

  const handleTooltipClose = () => {
    setOpen(false);
  };

  const handleTooltipOpen = () => {
    setOpen(true);
  };

  return (
    <PixelInfoTabBlock active={active}>
      <ActionPanelTabBody>
        {adjustedCoords ?
          <div>
            <CoordinatesCard coordinates={adjustedCoords} />
            <PixelHistoryCurrent history={pixelHistory} isLoading={isLoading} />
          </div>
        : <p>No selected pixel</p>}
      </ActionPanelTabBody>
      <ScrollBlock>
        {adjustedCoords && pixelHistory.length > 1 ?
          <ActionPanelTabBody>
            <div>
              <PixelHistoryPast history={pixelHistory} isLoading={isLoading} />
            </div>
          </ActionPanelTabBody>
        : <></>}
      </ScrollBlock>
      <ActionPanelTabBody>
        {adjustedCoords && (
          <Tooltip
            title="Copied!"
            placement={"top"}
            onClose={handleTooltipClose}
            open={open}
            componentsProps={{
              tooltip: {
                sx: {
                  bgcolor: "var(--discord-legacy-dark-but-not-black);",
                  boxShadow: "0px 0px 5px rgba(0, 0, 0, 0.25)",
                },
              },
            }}
            slotProps={{
              popper: {
                modifiers: [
                  {
                    name: "offset",
                    options: {
                      offset: [0, -10],
                    },
                  },
                ],
              },
            }}
          >
            <DynamicButton
              color={
                !isLoading && pixelHistory.length > 0 ?
                  pixelHistory[0].color
                : null
              }
              onAction={() => {
                handleTooltipOpen();
                navigator.clipboard.writeText(coordsLink);
              }}
            >
              {"Copy link to share pixel"}
              <CoordinateLabel>
                {`(${adjustedCoords.x},\u00A0${adjustedCoords.y})`}
              </CoordinateLabel>
            </DynamicButton>
          </Tooltip>
        )}
      </ActionPanelTabBody>
    </PixelInfoTabBlock>
  );
}
