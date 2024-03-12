import React from 'react';
import {Box, Container, CssBaseline, Typography} from '@mui/material';
import CASButton from "@/app/components/CASButton";
import LoginForm from "@/app/components/LoginForm";

const LoginCard: React.FC = () => {
    return (
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
                    <LoginForm></LoginForm>
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
                    <CASButton></CASButton>
                </form>
            </Box>
        </Container>
    );
};

export default LoginCard;
