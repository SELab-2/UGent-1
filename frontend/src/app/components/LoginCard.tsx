import React from 'react';
import {Box, Container, CssBaseline, Typography} from '@mui/material';
import CASButton from "@/app/components/CASButton";
import LoginForm from "@/app/components/LoginForm";
import Image from 'next/image';
import logo from '../../../public/logo.png'

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
                <Box
                    sx={{
                        height: 120, // Adjust this value as needed for your layout
                        width: '100%',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center', // This will center the image vertically
                    }}
                >
                    <Image
                        alt="logo"
                        src={logo}
                        layout="intrinsic" // This tells Next.js to use the image's intrinsic size
                        objectFit="contain" // This prevents the image from being stretched
                        width={200} // Set the width of your image here
                        height={100} // Set the height of your image here
                    />
                </Box>
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
