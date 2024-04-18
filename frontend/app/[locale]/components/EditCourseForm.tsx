"use client"
import React, {useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import Image from 'next/image';
import {getCourse, getImage, postData, updateCourse} from "@lib/api";
import Typography from "@mui/material/Typography";
import {Button, TextField, Box, Input, Select, MenuItem} from "@mui/material";
import { visuallyHidden } from '@mui/utils';
import UploadFileIcon from '@mui/icons-material/UploadFile';

interface EditCourseFormProps {
    courseId: number
}

const EditCourseForm = ({courseId}: EditCourseFormProps) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [open, setOpen] = useState(false);
    const {t} = useTranslation();
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [selectedImageURL, setSelectedImageURL] = useState<string>("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCourseData = async () => {
            try {
                const course = await getCourse(courseId);
                setName(course.name);
                setDescription(course.description);
                setOpen(course.open_course);
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
        const formData = new FormData();
        formData.append('name', name);
        formData.append('description', description);
        formData.append('open_course', open.toString());
        const fileReader = new FileReader();
        fileReader.onload = async function () {
            const arrayBuffer = this.result;
            if (arrayBuffer !== null) {
                formData.append('banner', new Blob([arrayBuffer], {type: 'image/png'}));
                await postData("/courses/", formData).then((response) => {
                    window.location.href = `/course/${response.course_id}`;
                });
            }
        }
        if (selectedImage) fileReader.readAsArrayBuffer(selectedImage);
        await updateCourse(courseId, formData);
        // window.location.href = `/course/${courseId}/`;
    };

    const handleImageUpload = (event: any) => {
        const imageFile = event.target.files[0];
        setSelectedImage(imageFile);

        const imageURL = URL.createObjectURL(imageFile);
        setSelectedImageURL(imageURL);
    };

    return (
        loading ? (<div>Loading...</div>) : (
            <Box
                component={"form"}
                onSubmit={handleSubmit}
            >
                <Box sx={{marginTop: '10px'}}>
                    <Typography
                        variant="h3"
                    >
                        {t("course name")}
                    </Typography>
                    <TextField type="text" id="name" name="name" defaultValue={name}
                               onChange={(event: any) => setName(event.target.value)} required style={{
                        fontSize: '20px',
                        fontFamily: 'Quicksand, sans-serif',
                        borderRadius: '6px',
                        height: '30px',
                        width: '400px'
                    }}/>
                </Box>
                <Box sx={{marginTop: '16px', borderRadius: '12px', height: 'fit-content'}}>
                    <Typography
                        variant="h3"
                    >
                        {t("banner")}
                    </Typography>
                    <Box
                        borderRadius={'16px'}
                        sx={{position: 'relative', width: '100%', height: '100%', borderRadius: '16px',}}
                    >
                        <Image
                            src={selectedImageURL}
                            layout="fill"
                            objectFit="cover"
                        />
                        </Box>
                </Box>
                <Box sx={{marginTop: '16px'}}>
                    <Button variant={"contained"} color={"secondary"} size={'small'}
                            startIcon={<UploadFileIcon color={'secondary.contrastText'}/>}
                            disableElevation
                            component="label"
                            role={undefined}
                            tabIndex={-1}
                            sx={{
                                padding: 1,
                                width: 'fit-content',
                                color: 'secondary.contrastText'
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
                    sx={{marginTop: '16px', position: 'absolute', gap: 2}}
                >
                    <Button
                        type="submit"
                        sx={{
                            width: 'fit-content',
                        }}
                    >
                        {t("save changes")}
                    </Button>
                    <Button
                        href={'/course/' + courseId + "/"}
                        color={'secondary'}
                        sx={{
                            width: 'fit-content',
                            color: 'secondary.contrastText'
                        }}
                    >
                        {t("cancel")}
                    </Button>
                </Box>
            </Box>
        ));

}

export default EditCourseForm