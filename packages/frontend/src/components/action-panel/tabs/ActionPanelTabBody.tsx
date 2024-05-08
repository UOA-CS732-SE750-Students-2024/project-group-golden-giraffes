import { styled } from "@mui/material";

export const ActionPanelTabBody = styled("div")<{ active?: boolean }>`
  --padding-width: 1rem;

  display: ${({ active }) => (active ? "block flex" : "none")};
  flex-direction: column;
  background-color: var(--discord-legacy-not-quite-black);
  border-radius: calc(var(--card-border-radius) - var(--padding-width));
  gap: 0.5rem;

  > * {
    background-color: var(--discord-legacy-dark-but-not-black);
    margin-trim: block;
    padding: var(--padding-width);

    @supports not (margin-trim: block) {
      > :first-child {
        margin-block-start: 0;
      }
      > :last-child {
        margin-block-end: 0;
      }
    }
  }
`;
