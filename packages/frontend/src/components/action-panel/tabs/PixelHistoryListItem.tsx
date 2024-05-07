import { styled } from "@mui/material";

import { PixelHistoryRecord } from "@blurple-canvas-web/types";

import { PaletteColorRecord } from "@/components/color/Color";
import { StaticSwatch } from "@/components/swatch";

const Wrapper = styled("div")`
  align-items: center;
  display: flex;
  gap: 1rem;
  justify-content: space-between;
`;

const RecordInfo = styled("div")`
  display: flex;
  flex-direction: column;
  flex: 1;
  gap: 0.5rem;
`;

const Username = styled("p")`
  font-size: 1.125rem;
  letter-spacing: 0.005em;
  margin-block: 0;
`;

const StyledPaletteColorRecord = styled(PaletteColorRecord)`
  color: oklch(var(--discord-white-oklch) / 0.6);
  letter-spacing: 0.005em;
`;

export default function HistoryRecordComponent({
  record,
}: {
  record: PixelHistoryRecord;
}) {
  if (!record) return null;
  const { color, userProfile } = record;

  return (
    <Wrapper>
      <StaticSwatch key={color.code} rgba={color.rgba} />
      <RecordInfo>
        <Username title={userProfile.id}>{userProfile.username}</Username>

        <StyledPaletteColorRecord color={record.color} displaySwatch={false} />
      </RecordInfo>
    </Wrapper>
  );
}
