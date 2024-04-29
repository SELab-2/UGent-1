"use client";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import {Stack} from "@mui/material";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Link from "next/link";
import React, {useEffect, useState} from "react";
import {displayRole} from '@lib/utils';
import {APIError, getImage, getUserData, updateUserData, UserData} from "@lib/api"; // Assume updateUserData is the method to update user data
import {useTranslation} from "react-i18next";

const ProfileEditCard = () => {
    const [user, setUser] = useState<UserData>({
        id: 0,
        email: "",
        first_name: "",
        last_name: "",
        course: [],
        role: 3,
        picture: ""
    });
    const [error, setError] = useState<APIError | null>(null);
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [selectedImageURL, setSelectedImageURL] = useState<string>("");
    const [showEditIcon, setShowEditIcon] = useState(false);
    const {t} = useTranslation();

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const userData = await getUserData();
                setUser(userData);
                if (userData.picture) {
                    const imageBlob = await getImage(userData.picture);
                    const imageUrl = URL.createObjectURL(imageBlob);
                    setSelectedImageURL(imageUrl);
                }
            } catch (error) {
                if (error instanceof APIError) setError(error);
            }
        };

        fetchUser();
    }, []);

    const handleProfilePicChange = (event: any) => {
        const file = event.target.files[0];
        if (file) {
            setSelectedImage(file);
            setSelectedImageURL(URL.createObjectURL(file));  // Preview the selected image
        }
    };

    const handleSaveChanges = async (event: any) => {
        event.preventDefault();
        if (selectedImage) {
            const formData = new FormData();
            formData.append('email', user.email);  // Assuming you want to send email or other user details
            formData.append('first_name', user.first_name);
            formData.append('last_name', user.last_name);
            formData.append('course', user.course);
            const fileReader = new FileReader();
            fileReader.onload = async () => {
                const arrayBuffer = fileReader.result;
                formData.append('picture', new Blob([arrayBuffer], {type: 'image/png'}));
                try {
                    await updateUserData(user.id, formData).then((response) => {
                        window.location.href = '/profile/';
                    });
                } catch (error) {
                    if (error instanceof APIError) setError(error);
                }
            };
            fileReader.readAsArrayBuffer(selectedImage);
        }
    };

    const handleAvatarHover = () => {
        setShowEditIcon(true);
    };

    const handleAvatarLeave = () => {
        setShowEditIcon(false);
    };

    return (
        <Box sx={{maxWidth: {xs: '90%', sm: '600px'}, mx: 'auto', mt: 2, mb: 2}}>
            <Card>
                <CardContent>
                    <Stack direction="column" alignItems="center" spacing={2}>
                        <Box sx={{position: 'relative', display: 'inline-block'}}
                             onMouseEnter={handleAvatarHover} onMouseLeave={handleAvatarLeave}>
                            <Avatar
                                src={selectedImageURL}
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
                        <Box sx={{display: 'flex', gap: 2, width: '100%', justifyContent: 'center'}}>
                            <Button variant="contained" color="primary" data-testid="save-changes" onClick={handleSaveChanges}>
                                {t('save_changes')}
                            </Button>
                            <Link href="/profile" passHref>
                                <Button variant="outlined">
                                    {t('cancel')}
                                </Button>
                            </Link>
                        </Box>
                    </Stack>
                </CardContent>
            </Card>
        </Box>
    );
}

export default ProfileEditCard;
