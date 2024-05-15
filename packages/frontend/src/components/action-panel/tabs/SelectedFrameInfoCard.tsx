import { Frame } from "@blurple-canvas-web/types";
import { styled } from "@mui/material";

const Wrapper = styled("div")`
  // kinda stolen from SelectedColorInfoCard.tsx
  align-items: baseline;
  color: oklch(var(--discord-white-oklch) / 60%);
  display: grid;
  font-size: 1.375rem;
  // grid-template-columns: 1fr auto;
`;

const Heading = styled("h3")`
  color: var(--discord-white);
  font-weight: 900;
  line-height: 1.1;
`;

export default function FrameInfoCard({ frame }: { frame?: Frame }) {
  if (!frame) return <Wrapper>No frame selected</Wrapper>;

  return (
    <Wrapper>
      <Heading>{frame.name}</Heading>
      <p>Owner: {frame.ownerGuild?.name || frame.ownerUser?.username}</p>
      <p>
        Coordinates: {frame.x_0}, {frame.y_0} - {frame.x_1}, {frame.y_1}
      </p>
    </Wrapper>
  );
}
