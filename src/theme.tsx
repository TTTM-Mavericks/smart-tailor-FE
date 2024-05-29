import { experimental_extendTheme as extendTheme } from '@mui/material/styles';

// color design tokens export
export const tokens = (mode: any) => ({
  ...(mode === "dark"
    ? {
      primary: {
        100: "#212130",
        200: "#F5F5F5",
        300: "#F93A0B",
        400: "#17171E",
        500: "#F2F7FF",
        600: "#212130"
      }
    }
    : {
      primary: {
        100: "#F5F5F5",
        200: "#17171E",
        300: "#F93A0B",
        400: "#FFFFFF",
        500: "#FFFFFF",
        600: "#FFFFFF",
      }
    }),
});

// Get light dark mode
const theme = extendTheme({
  colorSchemes: {
    light: {
      palette: {
        primary: {
          main: "#EC6208"
        }
      }
    },
    dark: {
      palette: {
        primary: {
          main: "#EC6208"
        }
      }
    }
  }
});

export default theme
