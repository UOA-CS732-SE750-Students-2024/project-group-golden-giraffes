import { Skeleton, styled } from "@mui/material";

import { PixelHistoryRecord } from "@blurple-canvas-web/types";

import ColorCodeChip from "@/components/ColorCodeChip";
import { StaticSwatch } from "@/components/swatch";

const Wrapper = styled("div")`
  align-items: center;
  display: grid;
  gap: 1rem;
  grid-template-columns: auto 1fr;
`;

const StyledSwatch = styled(StaticSwatch)`
  border: 0.125rem solid var(--discord-white);
  width: 3rem;
`;

const SwatchSkeleton = styled(Skeleton)`
  aspect-ratio: 1;
  border-radius: 0.5rem;
  width: 3rem;
  height: auto;
`;

const Username = styled("p")`
  font-size: 1.125rem;
  letter-spacing: 0.005em;
`;

const UsernameSkeleton = styled(Skeleton)`
  border-radius: 0.25rem;
  width: 40%;
`;

const ColorName = styled("p")`
  color: oklch(var(--discord-white-oklch) / 0.6);
  letter-spacing: 0.005em;
`;

const ColorNameSkeleton = styled(Skeleton)`
  border-radius: 0.25rem;
  width: 50%;
`;

export default function PixelHistoryListItem({
  record,
}: {
  record?: PixelHistoryRecord;
}) {
  const { color, userProfile } = record || {};

  return (
    <Wrapper>
      {record ?
        <StyledSwatch key={color.code} rgba={color.rgba} />
      : <SwatchSkeleton variant="rectangular" />}
      <div>
        <Username title={record?.userId}>
          {record ?
            userProfile?.username ?? record.userId
          : <Skeleton style={{ width: "40%" }} />}
        </Username>
        <ColorName>
          {record ?
            <>
              {color.name} <ColorCodeChip color={color} />
            </>
          : <Skeleton style={{ width: "50%" }} />}
        </ColorName>
      </div>
    </Wrapper>
  );
}
