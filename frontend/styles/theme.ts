"use client";
import {createTheme, PaletteOptions} from '@mui/material/styles';
import {Palette} from '@mui/material/styles/createPalette';

declare module '@mui/material/styles/createPalette' {
    interface Palette {
        failure?: Palette['primary'];
    }

    interface PaletteOptions {
        failure?: PaletteOptions['primary'];
    }
}

export const baseTheme = createTheme({
    palette: {
        primary: {
            main: '#1E64C8',
            contrastText: '#FFFFFF'
        },
        secondary: {
            main: '#D0E4FF',
            contrastText: '#001D36'
        },
        background: {
            default: '#f4f5fd',
        },
        text: {
            primary: '#001D36',
            secondary: '#FFFFFF'
        },
    },
});

const loginTheme = createTheme({
    palette: {
        background: {
            default: '#f4f5fd'
        },
        primary: {
            main: '#1E64C8',
            contrastText: '#FFFFFF'
        },
        secondary: {
            main: '#D0E4FF',
            contrastText: '#001D36'
        },
        failure: {
            main: '#E15E5E'
        },
        success: {
            main: '#7DB47C'
        }
    },
    typography: {
        fontFamily: 'Quicksand, sans-serif',
        h4: {
            fontWeight: 700,
        },
        h1: {
            fontWeight: 400,
        },
    },
    components: {
        MuiTextField: {
            defaultProps: {
                InputLabelProps: {
                    shrink: true,
                },
                margin: 'normal',
                required: true,
                fullWidth: true,
            },
        },
        MuiButton: {
            defaultProps: {
                variant: 'contained',
                color: 'primary',
                fullWidth: true,
                style: {margin: '10px 0'},
            },
        },
    },
});

export const theme = createTheme({
    palette: {
        primary: {
            main: '#1E64C8',
            contrastText: '#FFFFFF'
        },
        secondary: {
            main: '#D0E4FF',
            contrastText: '#001D36'
        },
        background: {
            default: '#f4f5fd',
        },
        text: {
            primary: '#001D36',
            secondary: '#FFFFFF'
        },
    },
});

export const CourseCardTheme = createTheme(baseTheme, {
    components: {
        MuiCard: {
            styleOverrides: {
                root: {
                    maxWidth: 345,
                    margin: '16px',
                    boxShadow: '0px 2px 4px -1px rgb(0 0 0 / 20%), 0px 4px 5px 0px rgb(0 0 0 / 14%), 0px 1px 10px 0px rgb(0 0 0 / 12%)',
                    borderRadius: '4px',
                },
            },
        },

        MuiTableContainer: {
            styleOverrides: {
                root: {
                    boxShadow: 'none',
                    border: '1px solid #E0E0E0', // This will add the outline to the table
                    borderRadius: '4px',
                },
            },
        },

        MuiTableCell: {
            styleOverrides: {
                head: {
                    backgroundColor: '#D0E4FF',
                    color: '#001D36',
                    fontWeight: 'bold',
                },
                body: {
                    fontSize: '0.875rem',
                },
            },
        },
        MuiTableHead: {
            styleOverrides: {
                root: {
                    '.MuiTableCell-root': {
                        padding: '8px',
                        fontSize: '0.875rem',
                    },
                },
            },
        },
    }
});

export default baseTheme;