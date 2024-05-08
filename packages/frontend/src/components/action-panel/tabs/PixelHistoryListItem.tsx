import { styled } from "@mui/material";

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

const Username = styled("p")`
  font-size: 1.125rem;
  letter-spacing: 0.005em;
`;

const ColorName = styled("p")`
  color: oklch(var(--discord-white-oklch) / 0.6);
  letter-spacing: 0.005em;
`;

export default function PixelHistoryListItem({
  record,
}: {
  record: PixelHistoryRecord;
}) {
  if (!record) return null;
  const { color, userProfile } = record;

  return (
    <Wrapper>
      <StyledSwatch key={color.code} rgba={color.rgba} />
      <div>
        <Username title={userProfile.id}>{userProfile.username}</Username>
        <ColorName>
          {color.name} <ColorCodeChip color={color} />
        </ColorName>
      </div>
    </Wrapper>
  );
}
