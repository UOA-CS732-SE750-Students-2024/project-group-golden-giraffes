import { styled } from "@mui/material";

export const ActionPanelTab = styled("div")`
  display: flex;
  flex-direction: column;
  gap: 1rem;

  > * {
    background-color: var(--discord-legacy-dark-but-not-black);
    padding: 1rem;
  }
`;
