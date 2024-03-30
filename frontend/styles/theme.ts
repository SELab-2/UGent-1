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

const ProfileCardTheme = createTheme(baseTheme, {
    components: {
        MuiCard: {
            styleOverrides: {
                root: {
                    maxWidth: '345px',
                    margin: 'auto',
                    marginTop: '16px',
                    marginBottom: '16px',
                    boxShadow: '0px 2px 4px -1px rgb(0 0 0 / 20%), 0px 4px 5px 0px rgb(0 0 0 / 14%), 0px 1px 10px 0px rgb(0 0 0 / 12%)',
                    borderRadius: '10px',
                },
            },
        },
        MuiCardContent: {
            styleOverrides: {
                root: {
                    // Update the padding here
                    padding: '20px', // This padding is inside the card
                    '&:last-child': {
                        paddingBottom: '20px', // Ensures that the padding applies to the bottom of the card content as well
                    },
                },
            },
        },
        // ...additional overrides for other components
    },
});

export default baseTheme;
