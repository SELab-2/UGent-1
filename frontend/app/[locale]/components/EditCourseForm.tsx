"use client"
import React, {useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import {getCourse, getImage, postData, updateCourse} from "@lib/api";
import Typography from "@mui/material/Typography";
import {Box, Button, Input, LinearProgress, MenuItem, Select, TextField, Dialog, DialogActions, DialogTitle} from "@mui/material";
import {LocalizationProvider} from "@mui/x-date-pickers/LocalizationProvider";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import {DatePicker} from '@mui/x-date-pickers/DatePicker';
import {visuallyHidden} from '@mui/utils';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import dayjs from "dayjs";
import defaultBanner from "../../../public/ugent_banner.png";

interface EditCourseFormProps {
    courseId: number
}

const EditCourseForm = ({courseId}: EditCourseFormProps) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [open, setOpen] = useState(false);
    const [year, setYear] = useState(0);
    const {t} = useTranslation();
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [selectedImageURL, setSelectedImageURL] = useState<string>("");
    const [loading, setLoading] = useState(true);
    const [openConfirmation, setOpenConfirmation] = useState(false); // State for confirmation dialog


    useEffect(() => {
        const fetchCourseData = async () => {
            try {
                const course = await getCourse(courseId);
                setName(course.name);
                setDescription(course.description);
                setOpen(course.open_course);
                setYear(course.year);
                const image = await getImage(course.banner);
                const fileReader = new FileReader();
                fileReader.onload = function () {
                    const arrayBuffer = this.result;
                    if (arrayBuffer !== null) {
                        const blob = new Blob([arrayBuffer], {type: 'image/png'});
                        const file = new File([blob], "filename", {type: "image/png"});
                        setSelectedImage(file);
                        setSelectedImageURL(URL.createObjectURL(file));
                    }
                }

                fileReader.readAsArrayBuffer(image);
            } catch (error) {
                console.error("There was an error fetching the course data:", error);
            }
            setLoading(false);
        };

        fetchCourseData();
    }, [courseId]);

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
        formData.append('year', year.toString());
        const fileReader = new FileReader();
        fileReader.onload = async function () {
            const arrayBuffer = this.result;
            if (arrayBuffer !== null) {
                formData.append('banner', new Blob([arrayBuffer], { type: 'image/png' }));
                await updateCourse(courseId, formData).then((response) => {
                    window.location.href = `/course/${courseId}/`;
                });
            }
        }
        if (selectedImage) fileReader.readAsArrayBuffer(selectedImage);
    };


    const handleImageUpload = (event: any) => {
        const imageFile = event.target.files[0];
        setSelectedImage(imageFile);

        const imageURL = URL.createObjectURL(imageFile);
        setSelectedImageURL(imageURL);
    };

    if (loading) {
        return <LinearProgress/>;
    }

    return (
        <Box
            component={"form"}
            onSubmit={handleSubmit}
            sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-evenly',
                flexWrap: 'no-wrap',
                height: 'fit-content',
                width: '100%',
            }}
        >
            <Box
                height={'fit-content'}
            >
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
                    style={{
                        fontSize: '20px',
                        fontFamily: 'Quicksand, sans-serif',
                        borderRadius: '6px',
                        height: '30px',
                        width: '400px',
                        marginBottom: '32px'
                    }}/>
            </Box>
            <Box
                height={'fit-content'}
            >
                <Typography variant={"h3"}>
                    {t("year")}
                </Typography>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                        views={['year']}
                        value={year !== 0 ? dayjs().year(year) : null}
                        onChange={(date: any) => setYear(date.year())}
                        sx={{
                            width: 'fit-content',
                            height: 'fit-content',
                        }}
                    />
                </LocalizationProvider>
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
                        src={selectedImageURL ? selectedImageURL : defaultBanner.src}
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
                <TextField id="description" name="description" defaultValue={description}
                           label="Description"
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
                    onClick={handleSubmit}
                    sx={{
                        width: 'fit-content',
                        backgroundColor: 'primary.main',
                        color: 'primary.contrastText'
                    }}
                >
                    {t("save changes")}
                </Button>
                <Button
                    href={'/course/' + courseId + "/"}
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
                        {t("edit course")}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}

export default EditCourseForm
