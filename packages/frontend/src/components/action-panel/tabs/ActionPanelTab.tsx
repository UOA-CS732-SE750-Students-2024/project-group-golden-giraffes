import { styled } from "@mui/material";

export const ActionPanelTab = styled("div")`
  display: flex;
  flex-direction: column;
  gap: 1rem;

  > * {
    background-color: var(--discord-legacy-dark-but-not-black);
    margin-trim: block;
    padding: 1rem;

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
