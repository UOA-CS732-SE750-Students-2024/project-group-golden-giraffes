import { styled } from "@mui/material";

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
}: {
  color?: PaletteColor | null;
  invite?: string;
}) {
  if (!color) return <Wrapper>No color selected</Wrapper>;

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
          This color can be used in{" "}
          {invite ?
            <a href={invite}>{guildName}</a>
          : guildName}
        </Subtitle>
      )}
    </Wrapper>
  );
}
