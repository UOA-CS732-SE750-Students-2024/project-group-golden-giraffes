"use client";
import { createTheme } from "@mui/material";

/*
 * CSS variables are defined in ../styles/core.css
 */

export const Theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#5865F2",
    },
    secondary: {
      main: "#EB459E",
    },
    success: {
      main: "#57F287",
    },
    error: {
      main: "#ED4245",
    },
    warning: {
      main: "#FEE75C",
    },
    info: {
      main: "#5865F2",
    },
  },
  typography: {
    fontFamily: "var(--font-sans)",
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          fontWeight: 450,
          // backgroundColor: theme.palette.primary.main,
          letterSpacing: "0.02em",
          textTransform: "none",
          boxShadow: "none",
          borderRadius: ".5rem",
          "&:hover": {
            boxShadow: "none",
          },
          "&:active": {
            boxShadow: "none",
          },
        },
      },
    },
  },
});
