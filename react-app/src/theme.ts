import { createTheme } from "@mui/material/styles";
import { lightBlue, cyan, amber } from "@mui/material/colors";

const theme = createTheme({
    palette: {
        primary: {
            light: lightBlue[100],
            main: lightBlue[400],
            dark: lightBlue[900],
            contrastText: "#fff",
        },
        secondary: {
            light: cyan.A100,
            main: cyan.A400,
            dark: cyan.A700,
            contrastText: lightBlue[900],
        },
        warning: {
            light: amber[300],
            main: amber.A200,
            dark: amber[900],
            contrastText: "#7f3700",
        },
        background: {
            default: lightBlue[50],
            paper: "#fff",
        },
        text: {
            primary: lightBlue[900],
            secondary: lightBlue[700],
        },
    },
    typography: {
        fontFamily: '"Nunito", "Roboto", "Helvetica", "Arial", sans-serif',
        fontWeightLight: 400,
        fontWeightRegular: 600,
        fontWeightMedium: 700,
        fontWeightBold: 900,
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 15,
                    fontWeight: 800,
                },
            },
        },
    },
});

export default theme;
