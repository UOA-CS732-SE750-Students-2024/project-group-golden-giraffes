import { styled } from "@mui/material";

export const ActionPanelTab = styled("div")`
  display: flex;
  flex-direction: column;
  gap: 1rem;

  > * {
    --padding-width: 1rem;

    background-color: var(--discord-legacy-dark-but-not-black);
    border-radius: calc(var(--card-border-radius) - var(--padding-width));
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
