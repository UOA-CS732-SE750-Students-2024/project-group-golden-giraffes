import { useAuthContext } from "@/contexts";
import { useFrame } from "@/hooks/queries/useFrame";
import { decodeUserGuildsBase64 } from "@/util";
import { Frame } from "@blurple-canvas-web/types";
import { styled } from "@mui/material";
import { Heading } from "../ActionPanel";
import {
  ActionPanelTabBody,
  ScrollBlock,
  TabBlock,
} from "./ActionPanelTabBody";
import BotCommandCard from "./BotCommandCard";
import FrameInfoCard from "./SelectedFrameInfoCard";

const FramesTabBlock = styled(TabBlock)`
  grid-template-rows: 1fr auto;
`;

interface FramesTabProps {
  active?: boolean;
  canvasId: number;
}

export default function FramesTab({ active, canvasId }: FramesTabProps) {
  const { user } = useAuthContext();

  if (user) {
    const { data: userFrames = [] } = useFrame({
      canvasId: canvasId,
      userId: user?.id,
    });

    const guildIds = decodeUserGuildsBase64(user);
    const { data: guildFrames = [] } = useFrame({
      canvasId: canvasId,
      guildIds: guildIds,
    });

    const guildFrameMap: { [key: string]: Frame[] } = guildFrames.reduce(
      (map, frame) => {
        const ownerId = frame.ownerId;
        if (!map[ownerId]) {
          map[ownerId] = [];
        }
        map[ownerId].push(frame);
        return map;
      },
      {} as { [key: string]: Frame[] },
    );

    const sortedGuildFrameMap = Object.entries(guildFrameMap).sort(
      ([, framesA], [, framesB]) => {
        const ownerGuildA = framesA[0]?.ownerGuild?.name || "";
        const ownerGuildB = framesB[0]?.ownerGuild?.name || "";
        return ownerGuildA.localeCompare(ownerGuildB);
      },
    );

    return (
      <FramesTabBlock active={active}>
        <ScrollBlock>
          <ActionPanelTabBody>
            <div>
              <Heading>Your Frames</Heading>
              {userFrames.map((frame) => (
                <div key={frame.id}>
                  <p>{frame.name}</p>
                </div>
              ))}

              {sortedGuildFrameMap.map(([ownerId, frames]) => (
                <div key={ownerId}>
                  <Heading>{frames[0]?.ownerGuild?.name}</Heading>
                  {frames
                    .sort((a, b) => a.name.localeCompare(b.name))
                    .map((frame) => (
                      <div key={frame.id}>
                        <p>{frame.name}</p>
                      </div>
                    ))}
                </div>
              ))}
            </div>
          </ActionPanelTabBody>
        </ScrollBlock>
        <ActionPanelTabBody>
          <FrameInfoCard frame={userFrames[0] ?? null} />
          {/* need to add select */}
          <BotCommandCard command={"/frame create"} />
        </ActionPanelTabBody>
      </FramesTabBlock>
    );
  }

  return (
    <FramesTabBlock active={active}>
      <ActionPanelTabBody>
        <Heading>Your Frames</Heading>
        <p>
          <a href="/signin">Sign in</a> to view frames
        </p>
      </ActionPanelTabBody>
    </FramesTabBlock>
  );
}
