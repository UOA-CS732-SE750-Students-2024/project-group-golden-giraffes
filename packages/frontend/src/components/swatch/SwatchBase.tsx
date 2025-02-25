import { css, styled } from "@mui/material";

import { doesNotStartWith$ } from "@/util";

export const SwatchBase = styled("div", {
  shouldForwardProp: doesNotStartWith$,
})<{ $colorString: string }>(
  (props) => css`
    aspect-ratio: 1;
    background-color: ${props.$colorString};
    border-radius: 0.5rem;
  `,
);
