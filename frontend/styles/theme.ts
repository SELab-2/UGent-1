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

export default loginTheme;
