import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#2196f3", // main blue
      light: "#64b5f6",
      dark: "#1976d2",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#90a4ae", // blue gray
      light: "#c1d5e0",
      dark: "#62757f",
      contrastText: "#ffffff",
    },
    background: {
      default: "#121212", // dark black
      paper: "#1e1e1e", // cards
    },
    text: {
      primary: "#ffffff", // white text
      secondary: "#b0bec5", // blue gray text
    },
  },
});
export default theme;