"use client"
import React, {useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import {getUser, updateUserData} from "@lib/api";
import Typography from "@mui/material/Typography";
import {Box, Button, Input, MenuItem, Select, TextField} from "@mui/material";

interface EditUserFormProps {
    userId: number
}

const EditUserForm = ({userId}: EditUserFormProps) => {
    const [firstname, setFirstName] = useState('');
    const [lastname, setLastName] = useState('');
    const [role, setRole] = useState('');
    const [email, setEmail] = useState('');
    const {t} = useTranslation();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCourseData = async () => {
            try {
                const user = await getUser(userId);
                setFirstName(user.first_name);
                setLastName(user.last_name);
                setRole(user.role);
                setEmail(user.email);
            } catch (error) {
                console.error("There was an error fetching the user data:", error);
            }
            setLoading(false);
        };

        fetchCourseData();
    }, [userId]);

    const handleSubmit = async (event: any) => {
        event.preventDefault();
        const formData = new FormData();
        formData.append('first_name', firstname);
        formData.append('last_name', lastname);
        formData.append('role', role.toString());
        formData.append('email', email);
        await updateUserData(userId, formData);
    };

    return (
        loading ? (<div>Loading...</div>) : (
            <Box
                component={"form"}
                onSubmit={handleSubmit}
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-evenly',
                    height: 'fit-content',
                    width: '100%',
                }}
            >
                <Typography
                    variant={'h3'}
                    paddingBottom={2}
                >
                    {t("edit_user_details")}
                </Typography>
                <Box
                    height={'fit-content'}
                    mb={3}
                >
                    <Typography
                        variant="h4"
                    >
                        {t("email")}
                    </Typography>
                    <Typography
                        variant={'body1'}
                        style={{

                            borderRadius: '6px',
                            height: 'fit-content',
                            width: '400px',
                            padding: '6px', // Add padding for better appearance
                            backgroundColor: '#f0f0f0', // Add background color for better contrast
                        }}
                    >
                        {email}
                    </Typography>
                </Box>
                <Box
                    height={'fit-content'}
                    mb={3}
                >
                    <Typography
                        variant="h4"
                    >
                        {t("first name")}
                    </Typography>
                    <TextField
                        type="text"
                        id="name"
                        name="name"
                        defaultValue={firstname}
                        onChange={(event: any) => setFirstName(event.target.value)}
                        required
                        style={{
                            fontSize: '20px',
                            borderRadius: '6px',
                            height: 'fit-content',
                            width: '400px'
                        }} />
                </Box>
                <Box
                    height={'fit-content'}
                    mb={3}
                >
                    <Typography
                        variant="h4"
                    >
                        {t("last name")}
                    </Typography>
                    <TextField
                        type="text"
                        id="name"
                        name="name"
                        defaultValue={lastname}
                        onChange={(event: any) => setLastName(event.target.value)}
                        required
                        style={{
                            fontSize: '20px',
                            borderRadius: '6px',
                            height: 'fit-content',
                            width: '400px'
                        }} />
                </Box>
                <Box
                    height={'fit-content'}
                    mb={3}
                >
                    <Typography
                        variant="h4"
                    >
                        {t("role")}
                    </Typography>
                    <Select
                        value={role}
                        onChange={(event: any) => setRole(event.target.value)}
                        style={{
                            fontSize: '20px',
                            borderRadius: '6px',
                            height: 'fit-content',
                            width: '400px'
                        }}
                    >
                        <MenuItem value={1}>{t("admin")}</MenuItem>
                        <MenuItem value={2}>{t("teacher")}</MenuItem>
                        <MenuItem value={3}>{t("student")}</MenuItem>
                    </Select>
                </Box>
                <Box
                    display={'flex'}
                    sx={{ marginTop: '16px', gap: 2 }}
                >
                    <Button
                        variant="contained"
                        type="submit"
                        color={'primary'}
                        sx={{
                            width: 'fit-content',
                            color: 'primary.contrastText'
                        }}
                    >
                        {t("save changes")}
                    </Button>
                    <Button
                        variant={'contained'}
                        href={'/admin/users'}
                        color='secondary'
                        sx={{
                            width: 'fit-content',
                            color: 'secondary.contrastText',
                        }}
                    >
                        {t("cancel")}
                    </Button>
                </Box>
            </Box>
        ));

}
export default EditUserForm 