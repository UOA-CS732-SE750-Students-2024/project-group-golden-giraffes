import { styled } from "@mui/material";

import { Point } from "@blurple-canvas-web/types";

export const Wrapper = styled("div")`
  color: var(--discord-white);
  display: block flex;
  font-family: var(--font-monospace);
  gap: 2rem;
  justify-content: center;
  padding: 0.5rem;
`;

export default function CoordinatesCard({
  coordinates,
}: {
  coordinates: Point;
}) {
  return (
    <Wrapper>
      <div>x:&nbsp;{coordinates.x}</div>
      <div>y:&nbsp;{coordinates.y}</div>
    </Wrapper>
  );
}
