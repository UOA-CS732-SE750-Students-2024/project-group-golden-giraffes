import { PaletteColor, Point } from "@blurple-canvas-web/types";
import { styled } from "@mui/material";

const Wrapper = styled("div")`
  align-items: baseline;
  color: oklch(var(--discord-white-oklch) / 60%);
  display: grid;
  font-size: 1.375rem;
  grid-template-columns: 1fr auto;
`;
const Code = styled("code")`
  color: var(--discord-white-oklch);
  line-height: 1.1;
`;

export default function BotCommandCard({
  color,
  coordinates,
}: {
  color?: PaletteColor | null;
  coordinates: Point;
}) {
  if (!color) return <Wrapper>No color selected</Wrapper>;

  const { x, y } = coordinates;

  return (
    <Wrapper>
      <Code>
        /place x:{x} y:{y} color:{color.code}
      </Code>
    </Wrapper>
  );
}
