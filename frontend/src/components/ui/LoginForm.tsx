import React, {useState} from 'react';
import {Box, Button, Container, CssBaseline, TextField, Typography} from '@mui/material';
import {createTheme, ThemeProvider} from '@mui/material/styles';
import SchoolIcon from '@mui/icons-material/School';

const theme = createTheme({
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

const LoginForm: React.FC = () => {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');

    const handleLogin = (): void => {
        // Implement your login logic here
        console.log('Login with:', email, password);
    };

    const handleCASLogin = (): void => {
        // Implement CAS login logic here
        console.log('Login with CAS');
    };

    return (
        <ThemeProvider theme={theme}>
            <Container component="main" maxWidth="xs">
                <CssBaseline/>
                <Box
                    sx={{
                        marginTop: 8,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        backgroundColor: 'white',
                        padding: 3,
                        borderRadius: 2,
                        boxShadow: 1,
                    }}
                >
                    <Typography component="h1" variant="h4" gutterBottom>
                        Pigeonhole
                    </Typography>
                    <form style={{width: '100%', marginTop: 1}} noValidate>
                        <TextField
                            label="Email"
                            autoComplete="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <TextField
                            label="Password"
                            type="password"
                            autoComplete="current-password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <Button onClick={handleLogin}>Login</Button>
                        <Box
                            sx={{
                                my: 1,
                                display: 'flex',
                                alignItems: 'center',
                                width: '100%',
                                justifyContent: 'center',
                            }}
                        >
                            <Typography variant="caption" component="div" color="text.secondary">
                                OR
                            </Typography>
                        </Box>
                        <Button
                            onClick={handleCASLogin}
                            fullWidth
                            variant="contained"
                            color="secondary"
                            startIcon={<SchoolIcon/>}
                        >
                            Login with CAS
                        </Button>
                    </form>
                </Box>
            </Container>
        </ThemeProvider>
    );
};

export default LoginForm;
