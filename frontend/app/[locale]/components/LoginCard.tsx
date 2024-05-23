import React from 'react';
import {Box, Container, CssBaseline} from '@mui/material';
import CASButton from "./CASButton";
import Image from 'next/image';
import logo from '../../../public/logo.png';

const LoginCard: React.FC = () => {
    /*
    * This component is the login card that is displayed on the login page.
    */
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
                {/* Image container Box */}
                <Box
                    sx={{
                        height: 120, // Adjust the height as needed
                        width: '100%',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginBottom: 4, // Adds space below the logo; adjust as needed
                    }}
                >
                    {/* Next Image component */}
                    <Image
                        alt="logo"
                        src={logo}
                        layout="intrinsic" // Use 'intrinsic' layout for Image component
                        width={200} // Set the width of the logo
                        height={120} // Set the height of the logo
                    />
                </Box>
                <CASButton/>
            </Box>
        </Container>
    );
};

export default LoginCard;
