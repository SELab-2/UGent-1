"use client"
import {postData} from "@lib/api";
import Box from "@mui/material/Box";
import {useTranslation} from "react-i18next";

import React, {useEffect, useState} from 'react';
import banner from '../../../public/ugent_banner.png'
import Typography from "@mui/material/Typography";
import {Button, Input, MenuItem, Select, TextField, 
    Dialog, DialogActions, DialogTitle} from "@mui/material";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import {visuallyHidden} from "@mui/utils";

const CreateCourseForm = () => {
    const { t } = useTranslation();
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [selectedImageURL, setSelectedImageURL] = useState<string>("");
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [open, setOpen] = useState(false);
    const [openConfirmation, setOpenConfirmation] = useState(false); // State for confirmation dialog

    const handleImageUpload = (event: any) => {
        const imageFile = event.target.files[0];
        setSelectedImage(imageFile);

        const imageURL = URL.createObjectURL(imageFile);
        setSelectedImageURL(imageURL);
    };

    const handleSubmit = async (event: any) => {
        event.preventDefault();
        setOpenConfirmation(true); // Open confirmation dialog
    };

    const handleConfirmationClose = () => {
        setOpenConfirmation(false);
    };

    const handleConfirmationYes = async () => {
        setOpenConfirmation(false);
        const formData = new FormData();
        formData.append('name', name);
        formData.append('description', description);
        formData.append('open_course', open.toString());
        const fileReader = new FileReader();
        fileReader.onload = async function () {
            const arrayBuffer = this.result;
            if (arrayBuffer !== null) {
                formData.append('banner', new Blob([arrayBuffer], { type: 'image/png' }));
                await postData("/courses/", formData).then((response) => {
                    window.location.href = `/course/${response.course_id}`;
                });
            }
        }
        if (selectedImage) fileReader.readAsArrayBuffer(selectedImage);
    };

    useEffect(() => {
        if (selectedImage === null) {
            fetch(banner.src)
                .then(response => response.blob())
                .then(blob => {
                    const file = new File([blob], "filename", {type: "image/png"});
                    setSelectedImage(file);
                    setSelectedImageURL(banner.src)
                })
        }
    }, [selectedImageURL, selectedImage]);

    return (
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
            <Box>
                <Typography
                    variant="h3"
                >
                    {t("course name")}
                </Typography>
                <TextField
                    type="text"
                    id="name"
                    name="name"
                    defaultValue={name}
                    onChange={(event: any) => setName(event.target.value)}
                    required
                    label={t('name')}
                    placeholder={t("course name")}
                    style={{
                        fontSize: '20px',
                        fontFamily: 'Quicksand, sans-serif',
                        borderRadius: '6px',
                        height: '30px',
                        width: '400px'
                    }}
                />
            </Box>
            <Box sx={{marginTop: '32px', height: 'fit-content'}}>
                <Typography
                    variant="h3"
                >
                    {t("banner")}
                </Typography>
                <Box
                    borderRadius={'16px'}
                    sx={{position: 'relative', width: '100%', height: 'fit-content', borderRadius: '16px',}}
                >
                    <Box
                        component={'img'}
                        alt={t('select image')}
                        src={selectedImageURL}
                        sx={{
                            borderRadius: '16px',
                            height: 'fit-content',
                            maxHeight: '200px',
                            width: '100%'
                        }}
                    />
                </Box>
            </Box>
            <Box>
                <Button variant={"contained"} color={"secondary"} size={'small'}
                        startIcon={<UploadFileIcon sx={{color: 'secondary.contrastText'}}/>}
                        disableElevation
                        component="label"
                        role={undefined}
                        tabIndex={-1}
                        sx={{
                            padding: 1,
                            width: 'fit-content',
                            color: 'secondary.contrastText',
                            marginTop: '16px'
                        }}
                >
                    {t("select image")}
                    <Input type="file"
                           id="Image"
                           name="Image"
                           onChange={handleImageUpload}
                           style={visuallyHidden}
                    />
                </Button>
            </Box>
            <Box sx={{marginTop: '16px'}}>
                <Typography
                    variant="h3"
                >
                    {t("description")}
                </Typography>
                <TextField id="description" name="description"
                           label="Description"
                           placeholder={t('description_of_your_course')}
                           multiline
                           rows={4}
                           onChange={(event: any) => setDescription(event.target.value)} required
                           style={{
                               width: '100%',
                               fontFamily: 'Quicksand',
                               color: 'black',
                               borderRadius: '6px',
                               padding: '10px',
                               boxSizing: 'border-box'
                           }}/>
            </Box>
            <Box sx={{marginTop: '16px'}}>
                <Typography
                    variant="h3"
                >
                    {t("access")}
                </Typography>
                <Select
                    id="choice"
                    name="choice"
                    label={t("access")}
                    value={open}
                    onChange={(event: any) => setOpen(event.target.value)}
                    sx={{
                        fontSize: '20px',
                        height: 'fit-content',
                    }}
                >
                    <MenuItem value="false">{t("private")}</MenuItem>
                    <MenuItem value="true">{t("public")}</MenuItem>
                </Select>
            </Box>
            <Box
                display={'flex'}
                sx={{marginTop: '16px', gap: 2}}
            >
                <Button
                    type="submit"
                    color={'primary'}
                    sx={{
                        width: 'fit-content',
                        backgroundColor: 'primary.main',
                        color: 'primary.contrastText'
                    }}
                >
                    {t("create_course")}
                </Button>
                <Button
                    href={'/home'}
                    sx={{
                        width: 'fit-content',
                        backgroundColor: 'secondary.main',
                        color: 'secondary.contrastText'
                    }}
                >
                    {t("cancel")}
                </Button>
            </Box>
            <Dialog
                open={openConfirmation}
                onClose={handleConfirmationClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">{t("Are you sure you want to submit this course?")}</DialogTitle>
                <DialogActions>
                    <Button onClick={handleConfirmationClose} color="primary">
                        {t("cancel")}
                    </Button>
                    <Button onClick={handleConfirmationYes} color="primary" autoFocus>
                        {t("create_course")}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    )
}

export default CreateCourseForm