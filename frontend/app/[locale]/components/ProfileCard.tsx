// components/ProfileCard.js
import React from 'react';
import {Stack, ThemeProvider} from '@mui/material';
import ProfileCardTheme from '../../../styles/theme';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import ProfileEditButton from './ProfileEditButton';

const ProfileCard = () => {
    return (
        <ThemeProvider theme={ProfileCardTheme}>
            <Box sx={{maxWidth: {xs: '90%', sm: '600px'}, mx: 'auto', mt: 2, mb: 2}}>
                <Card>
                    <CardContent>
                        <Stack direction="column" alignItems="center" spacing={2}>
                            <Avatar
                                sx={{width: 125, height: 125}}
                                src="/path-to-profile-image.jpg" // Replace with the path to the profile image
                                alt="Profile Image"
                            />
                            <Typography variant="h5" component="div">
                                Sample Name
                            </Typography>
                            <Typography variant="subtitle1" color="text.text">
                                SampleName@ugent.net
                            </Typography>
                            <Box sx={{width: '100%', textAlign: 'center'}}>
                                <Typography variant="body1">
                                    Role: Teacher
                                </Typography>
                            </Box>
                            <ProfileEditButton/>
                        </Stack>
                    </CardContent>
                </Card>
            </Box>
        </ThemeProvider>
    );
};

export default ProfileCard;
