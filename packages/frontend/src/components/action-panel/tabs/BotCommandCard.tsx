import { useCanvasContext, useSelectedColorContext } from "@/contexts";
import { styled } from "@mui/material";
import { Copy as CopyIcon } from "lucide-react";

const Wrapper = styled("div")`
  align-items: center;
  color: var(--discord-white-oklch);
  display: flex;
  font-size: 0.9rem;
  grid-template-columns: 1fr auto;
`;

const Code = styled("code")`
  color: var(--discord-white-oklch);
  flex: 1;
  letter-spacing: 0.05em;
  line-height: 1.1;
`;

interface CopyButtonProps {
  onClick?: () => void;
}

const StyledCopyIcon = styled(CopyIcon)`
  height: 1.325rem;
`;

const CopyButton = styled("button")<CopyButtonProps>`
  background-color: oklch(var(--discord-white-oklch) / 12%);
  border-radius: 0.5rem;
  border: none;
  color: var(--discord-white-oklch);
  cursor: pointer;
  display: flex;
  font-size: 1rem;
  padding: 0.4rem 0.3rem;
  place-items: center;
  transition: background-color var(--transition-duration-slow) ease;

  &:hover {
    background-color: oklch(var(--discord-white-oklch) / 24%);
  }

  &:active {
    background-color: oklch(var(--discord-white-oklch) / 6%);
  }
`;

export default function BotCommandCard({ command }: { command: string }) {
  return (
    <Wrapper>
      <Code>{command}</Code>
      <CopyButton
        onClick={() => {
          navigator.clipboard.writeText(command);
        }}
      >
        <StyledCopyIcon />
      </CopyButton>
    </Wrapper>
  );
}

export function PlaceBotCommandCard() {
  const { adjustedCoords: coordinates } = useCanvasContext();
  const { color } = useSelectedColorContext();

  if (!(coordinates && color)) return null;
  const { x, y } = coordinates;
  const command = `/place x:${x} y:${y} color:${color.code}`;

  return <BotCommandCard command={command} />;
}
