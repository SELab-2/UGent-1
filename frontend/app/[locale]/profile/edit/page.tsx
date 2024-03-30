"use client";
import React, {useState} from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import {Stack, ThemeProvider} from '@mui/material';
import CardContent from '@mui/material/CardContent';
import Avatar from '@mui/material/Avatar';
import ProfileCardTheme from "../../../../styles/theme";
import EditIcon from '@mui/icons-material/Edit';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Link from 'next/link';
import NavBar from "../../components/NavBar";

const EditProfile = () => {
    const [profilePic, setProfilePic] = useState('/path-to-current-profile-picture.jpg'); // Replace with your profile picture path
    const [showEditIcon, setShowEditIcon] = useState(false);

    const handleProfilePicChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setProfilePic(URL.createObjectURL(file));
        }
    };

    const handleSaveChanges = () => {
        // Implement save logic here
        console.log("saved")
    };

    const handleAvatarHover = () => {
        setShowEditIcon(true);
    };

    const handleAvatarLeave = () => {
        setShowEditIcon(false);
    };

    return (
        <ThemeProvider theme={ProfileCardTheme}>
            <NavBar/>
            <Box sx={{pt: 9}}>
                <Box sx={{maxWidth: {xs: '90%', sm: '600px'}, mx: 'auto', mt: 2, mb: 2}}>
                    <Card>
                        <CardContent>
                            <Stack direction="column" alignItems="center" spacing={2}>
                                <Box sx={{position: 'relative', display: 'inline-block'}}
                                     onMouseEnter={handleAvatarHover} onMouseLeave={handleAvatarLeave}>
                                    <Avatar
                                        src={profilePic}
                                        alt="Profile Image"
                                        sx={{width: 140, height: 140, cursor: 'pointer'}}
                                    />
                                    <input
                                        accept="image/*"
                                        style={{display: 'none'}}
                                        id="icon-button-file"
                                        type="file"
                                        onChange={handleProfilePicChange}
                                    />
                                    <label htmlFor="icon-button-file" style={{
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        right: 0,
                                        bottom: 0,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        cursor: 'pointer'
                                    }}>
                                        <IconButton
                                            color="primary"
                                            aria-label="upload picture"
                                            component="span"
                                            sx={{
                                                visibility: showEditIcon ? 'visible' : 'hidden',
                                                backgroundColor: 'rgba(255,255,255,0.8)',
                                                '&:hover': {backgroundColor: 'rgba(255,255,255,0.9)'}
                                            }}
                                        >
                                            <EditIcon/>
                                        </IconButton>
                                    </label>
                                </Box>
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
                                <Box sx={{display: 'flex', gap: 2, width: '100%', justifyContent: 'center'}}>
                                    <Button variant="contained" color="primary" onClick={handleSaveChanges}>
                                        Save Changes
                                    </Button>
                                    <Link href="/profile" passHref>
                                        <Button variant="outlined">
                                            Cancel
                                        </Button>
                                    </Link>
                                </Box>
                            </Stack>
                        </CardContent>
                    </Card>
                </Box>
            </Box>
        </ThemeProvider>
    )
        ;
};

export default EditProfile;
