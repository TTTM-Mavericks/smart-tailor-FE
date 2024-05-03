import { experimental_extendTheme as extendTheme } from '@mui/material/styles';

// color design tokens export
export const tokens = (mode: any) => ({
  ...(mode === "dark"
    ? {
      primary: {
        100: "#212130",
        200: "#F5F5F5",
        300: "#F93A0B",
        400: "#00FF00"
      }
    }
    : {
      primary: {
        100: "#FFFFFF",
        200: "#17171E",
        300: "#F93A0B",
        400: "#00FF00"
      }
    }),
});

// mui theme settings
export const themeSettings = (mode: any) => {
  const colors = tokens(mode);
  return {
    palette: {
      mode: mode,
      ...(mode === "dark"
        ? {
          // palette values for dark mode
          primary: {
            main: colors.primary[300],
          },
          secondary: {
            main: colors.primary[300],
          },
          neutral: {
            dark: colors.primary[300],
            main: colors.primary[300],
            light: colors.primary[300],
          },
          background: {
            default: colors.primary[200],
          },
        }
        : {
          // palette values for light mode
          primary: {
            main: colors.primary[300],
          },
          secondary: {
            main: colors.primary[300],
          },
          neutral: {
            dark: colors.primary[300],
            main: colors.primary[300],
            light: colors.primary[300],
          },
          background: {
            default: colors.primary[300],
          },
        }),
    },
    typography: {
      fontFamily: ["Source Sans Pro", "sans-serif"].join(","),
      fontSize: 12,
      h1: {
        fontFamily: ["Source Sans Pro", "sans-serif"].join(","),
        fontSize: 40,
      },
      h2: {
        fontFamily: ["Source Sans Pro", "sans-serif"].join(","),
        fontSize: 32,
      },
      h3: {
        fontFamily: ["Source Sans Pro", "sans-serif"].join(","),
        fontSize: 24,
      },
      h4: {
        fontFamily: ["Source Sans Pro", "sans-serif"].join(","),
        fontSize: 20,
      },
      h5: {
        fontFamily: ["Source Sans Pro", "sans-serif"].join(","),
        fontSize: 16,
      },
      h6: {
        fontFamily: ["Source Sans Pro", "sans-serif"].join(","),
        fontSize: 14,
      },
    },
  };
};

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
