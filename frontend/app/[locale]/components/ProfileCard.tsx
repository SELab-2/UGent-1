"use client";
import React, {useEffect, useState} from 'react';
import {Stack, ThemeProvider} from '@mui/material';
import ProfileCardTheme from '../../../styles/theme';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import {APIError, getUserData, UserData} from "@lib/api";
import {displayRole} from '@lib/utils';
import {useTranslation} from "react-i18next";
import Button from "@mui/material/Button";
import EditIcon from "@mui/icons-material/Edit";
import Link from "next/link";

const ProfileCard = () => {
    const [user, setUser] = useState<UserData>({id: 0, email: "", first_name: "", last_name: "", course: [], role: 3});
    const [error, setError] = useState<APIError | null>(null);
    const {t} = useTranslation()

    useEffect(() => {
        const fetchUser = async () => {
            try {
                setUser(await getUserData());
            } catch (error) {
                if (error instanceof APIError) setError(error);
            }
        };

        fetchUser();
    }, []);

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
                                {user.first_name} {user.last_name}
                            </Typography>
                            <Typography variant="subtitle1" color="text.text">
                                {user.email}
                            </Typography>
                            <Box sx={{width: '100%', textAlign: 'center'}}>
                                <Typography variant="body1">
                                    {t('role')}: {displayRole(user.role)}
                                </Typography>
                            </Box>
                            <Link href="/profile/edit" passHref>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    startIcon={<EditIcon />}
                                >
                                    {t('edit_account')}
                                </Button>
                            </Link>
                        </Stack>
                    </CardContent>
                </Card>
            </Box>
        </ThemeProvider>
    );
};

export default ProfileCard;
