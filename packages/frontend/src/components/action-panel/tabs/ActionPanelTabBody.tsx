import { styled } from "@mui/material";

export const ActionPanelTabBody = styled("div")<{ active?: boolean }>`
  display: ${({ active }) => (active ? "block flex" : "none")};
  flex-direction: column;
  background-color: var(--discord-legacy-not-quite-black);
  gap: 0.5rem;

  > * {
    background-color: var(--discord-legacy-dark-but-not-black);
    border-radius: inherit;
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
