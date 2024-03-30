// profile/page.tsx
import React from 'react';
import ProfileCard from '../components/ProfileCard';
import NavBar from '../components/NavBar';
import Box from '@mui/material/Box';

const ProfilePage = () => {
    return (
        <>
            <NavBar/>
            <Box sx={{pt: 9}}>
                <ProfileCard/>
            </Box>
        </>
    );
};

export default ProfilePage;
