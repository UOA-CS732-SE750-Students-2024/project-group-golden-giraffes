import { PaletteColor, Point } from "@blurple-canvas-web/types";
import { styled } from "@mui/material";

const Wrapper = styled("div")`
  align-items: baseline;
  color: var(--discord-white-oklch);
  display: grid;
  font-size: 1.2rem;
  grid-template-columns: 1fr auto;
`;

const Code = styled("code")`
  color: var(--discord-white-oklch);
  letter-spacing: 0.05em;
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
