import { styled } from "@mui/material";

const Wrapper = styled("div")`
  display: flex;
  flex-direction: column;
  gap: 1rem;

  > * {
    background-color: var(--discord-legacy-dark-but-not-black);
    padding: 1rem;
  }
`;

export default function ActionPanelTab({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Wrapper>{children}</Wrapper>;
}
