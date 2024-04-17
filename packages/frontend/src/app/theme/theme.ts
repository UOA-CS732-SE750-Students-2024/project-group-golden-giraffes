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
          borderRadius: ".5rem",
          fontSize: "1rem",
          fontWeight: 500,
          letterSpacing: "0.005em",
          textTransform: "none",
        },
      },
    },
  },
});
