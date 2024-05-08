import { styled } from "@mui/material";

import { PaletteColor } from "@blurple-canvas-web/types";

const Wrapper = styled("div")`
  align-items: baseline;
  color: oklch(var(--discord-white-oklch) / 60%);
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
    color: oklch(var(--discord-white-oklch) / 60%);
  }
`;

const Code = styled("code")`
  color: oklch(var(--discord-white-oklch) / 60%);
  line-height: 1.1;
`;

export default function ColorInfoCard({
  color,
}: {
  color?: PaletteColor | null;
}) {
  if (!color) return <Wrapper>No color selected</Wrapper>;

  const { name: colorName, code: colorCode, invite: inviteSlug } = color;

  return (
    <Wrapper>
      <div>
        <Heading>{colorName}</Heading>
      </div>
      <Code>{colorCode}</Code>
      {!color.global && (
        <Subtitle>
          This color can be used in {color.guildName ?? "a partnered server"}
        </Subtitle>
      )}
    </Wrapper>
  );
}
