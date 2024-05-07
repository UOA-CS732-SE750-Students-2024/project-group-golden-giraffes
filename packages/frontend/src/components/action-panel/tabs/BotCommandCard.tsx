import { PaletteColor, Point } from "@blurple-canvas-web/types";
import { styled } from "@mui/material";
import { ClipboardCopy } from "lucide-react";

const Wrapper = styled("div")`
  align-items: center;
  color: var(--discord-white-oklch);
  display: flex;
  font-size: 1.2rem;
  grid-template-columns: 1fr auto;
`;

const Code = styled("code")`
  color: var(--discord-white-oklch);
  flex: 1;
  letter-spacing: 0.05em;
  line-height: 1.1;
`;

interface CopyButtonProps {
  backgroundColor: PaletteColor;
  onClick?: () => void;
}

const CopyButton = styled("button", {
  shouldForwardProp: (prop) => prop !== "backgroundColor",
})<CopyButtonProps>`
  background-color: oklch(var(--discord-white-oklch) / 12%);
  border-radius: var(--card-border-radius);
  border: none;
  color: var(--discord-white-oklch);
  cursor: pointer;
  font-size: 1rem;
  padding: 0.3rem;
  transition: background-color var(--transition-duration-slow) ease;

  > svg {
    height: 1.325rem;
  }

  &:hover {
    background-color: rgba(
      ${({ backgroundColor }) => backgroundColor.rgba.slice(0, 3).join(", ")},
      36%
    );
  }

  &:active {
    background-color: rgba(
      ${({ backgroundColor }) => backgroundColor.rgba.slice(0, 3).join(", ")},
      6%
    );
  }
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

  const command = `/place x:${x} y:${y} color:${color.code}`;

  return (
    <Wrapper>
      <Code>{command}</Code>
      <CopyButton
        backgroundColor={color}
        onClick={() => {
          navigator.clipboard.writeText(command);
        }}
      >
        <ClipboardCopy />
      </CopyButton>
    </Wrapper>
  );
}
