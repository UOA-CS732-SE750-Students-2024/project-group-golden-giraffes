import { styled } from "@mui/material";

import { useCanvasContext } from "@/contexts";
import { PaletteColor } from "@blurple-canvas-web/types";

const Wrapper = styled("div")`
  align-items: baseline;
  color: oklch(from var(--discord-white) l c h / 60%);
  display: grid;
  font-size: 1.375rem;
  grid-template-columns: 1fr auto;
`;

const Heading = styled("h3")`
  color: var(--discord-white);
  font-weight: 900;
  line-height: 1.1;
`;

const Subtitle = styled("p")`
  font-size: 1rem;
  grid-column: 1/-1;
  letter-spacing: 0.005em;
  margin-block-start: 0.25rem;

  &,
  a {
    color: oklch(from var(--discord-white) l c h / 60%);
  }
`;

const Code = styled("code")`
  color: oklch(from var(--discord-white) l c h / 60%);
  line-height: 1.1;
`;

export default function ColorInfoCard({
  color,
  invite,
  isUserInServer: userInServer = false,
}: {
  color?: PaletteColor | null;
  invite?: string;
  isUserInServer?: boolean;
}) {
  if (!color) return <Wrapper>No color selected</Wrapper>;

  const { canvas } = useCanvasContext();

  const { name: colorName, code: colorCode } = color;

  const guildName = color.guildName ?? "a partnered server";

  return (
    <Wrapper>
      <div>
        <Heading>{colorName}</Heading>
      </div>
      <Code>{colorCode}</Code>
      {!color.global && (
        <Subtitle>
          {!canvas.allColorsGlobal ?
            !userInServer ?
              "This color can be used in"
            : "You can use this color in"
          : "This color is from"}{" "}
          {invite ?
            <a href={invite}>{guildName}</a>
          : guildName}
        </Subtitle>
      )}
    </Wrapper>
  );
}
