import React from 'react';
import {Box, Container, CssBaseline, Typography} from '@mui/material';
import CASButton from "@/app/components/CASButton";
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
                        height: 120,
                        width: '100%',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    <Image
                        alt="logo"
                        src={logo}
                        style={{
                            width: 200,
                            height: 200,
                            objectFit: 'contain',
                        }}
                        fill={false}
                    />
                </Box>
                <CASButton></CASButton>
            </Box>
        </Container>
    );
};

export default LoginCard;
