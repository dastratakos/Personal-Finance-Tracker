import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#00d4aa", // Teal accent
      light: "#4dd4b8",
      dark: "#00a085",
      contrastText: "#000000",
    },
    secondary: {
      main: "#ff6b6b", // Coral accent
      light: "#ff8e8e",
      dark: "#e55555",
      contrastText: "#ffffff",
    },
    background: {
      default: "#0a0a0a", // Deep black
      paper: "#1a1a1a", // Dark gray for cards
    },
    text: {
      primary: "#ffffff",
      secondary: "#b3b3b3",
    },
    divider: "#333333",
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
      fontSize: "2.5rem",
    },
    h2: {
      fontWeight: 600,
      fontSize: "2rem",
    },
    h3: {
      fontWeight: 600,
      fontSize: "1.75rem",
    },
    h4: {
      fontWeight: 600,
      fontSize: "1.5rem",
    },
    h5: {
      fontWeight: 500,
      fontSize: "1.25rem",
    },
    h6: {
      fontWeight: 500,
      fontSize: "1rem",
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
          backgroundColor: "#1a1a1a",
          border: "1px solid #333333",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.3)",
          "&:hover": {
            boxShadow: "0 8px 30px rgba(0, 0, 0, 0.4)",
            transform: "translateY(-2px)",
            transition: "all 0.3s ease",
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: "#0a0a0a",
          borderBottom: "1px solid #333333",
          boxShadow: "0 2px 10px rgba(0, 0, 0, 0.3)",
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: "#0f0f0f",
          borderRight: "1px solid #333333",
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          margin: "4px 8px",
          "&:hover": {
            backgroundColor: "#333333",
          },
          "&.Mui-selected": {
            backgroundColor: "#00d4aa20",
            "&:hover": {
              backgroundColor: "#00d4aa30",
            },
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: "none",
          fontWeight: 500,
        },
        contained: {
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.3)",
          "&:hover": {
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.4)",
          },
        },
      },
    },
  },
});
