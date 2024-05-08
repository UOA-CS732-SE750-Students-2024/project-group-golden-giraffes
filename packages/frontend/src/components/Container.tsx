import { styled } from "@mui/material";

export const Container = styled("main")`
  width: 100%;
  max-width: 900px;
  margin-inline: auto;
  padding-block: 2rem;

  ${({ theme }) => theme.breakpoints.down("md")} {
    margin-inline: 1rem;
  }
`;
