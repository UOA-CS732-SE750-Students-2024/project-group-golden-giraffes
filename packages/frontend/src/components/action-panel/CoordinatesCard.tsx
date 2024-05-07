import { styled } from "@mui/material";

import { Point } from "@blurple-canvas-web/types";

export const Wrapper = styled("div")`
  color: oklch(var(--discord-white-oklch) / 60%);
  display: block flex;
  font-family: var(--font-monospace);
  text-align: center;
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
