"use client";
import {createTheme} from '@mui/material/styles';

const loginTheme = createTheme({
    palette: {
        background: {
            default: '#f4f5fd'
        },
        primary: {
            main: '#1976d2',
        },
        secondary: {
            main: '#9c27b0',
        },
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

export default loginTheme;
