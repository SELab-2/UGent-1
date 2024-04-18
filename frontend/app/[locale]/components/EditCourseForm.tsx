"use client"
import React, {useEffect, useState} from "react";
import Box from "@mui/material/Box";
import {useTranslation} from "react-i18next";
import Image from 'next/image';
import {getCourse, getImage, postData, updateCourse} from "@lib/api";
import { Typography } from "@mui/material";

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
            <form onSubmit={handleSubmit}>
                <Box sx={{marginTop: '16px'}}>
                    <label htmlFor="name" style={{
                        fontSize: '32px',
                        fontFamily: 'Quicksand',
                        marginBottom: '-10px',
                        display: 'block'
                    }}>
                        <Typography variant="h3">{t("course name")}</Typography>
                        </label><br/>
                    <input type="text" id="name" name="name" defaultValue={name}
                           onChange={(event: any) => setName(event.target.value)} required style={{
                        fontSize: '20px',
                        fontFamily: 'Quicksand',
                        borderRadius: '6px',
                        height: '30px',
                        width: '400px'
                    }}/>
                </Box>
                <Box sx={{marginTop: '16px', borderRadius: '12px'}} style={{height: '250px'}}>
                    <label htmlFor="banner" style={{
                    }}>
                        <Typography variant="h4">{t("banner")}</Typography>
                    </label><br/>
                    <div style={{
                        width: '100%',
                        height: '200px',
                        overflow: 'hidden',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}>
                        <div style={{position: 'relative', width: '100%', height: '100%'}}>
                            <Image
                                src={selectedImageURL}
                                alt="Image"
                                layout="fill"
                                objectFit="cover"
                            />
                        </div>
                    </div>
                </Box>
                <Box sx={{marginTop: '16px'}}>
                    <label htmlFor="Image" style={{
                        cursor: 'pointer',
                        display: 'inline-block',
                        padding: '8px 16px',
                        border: '1px solid lightblue',
                        borderRadius: '4px',
                        backgroundColor: 'lightblue',
                        color: 'black',
                        fontFamily: 'Quicksand'
                    }}>
                        {t("select image")}
                        <input type="file" id="Image" name="Image" accept="image/*" onChange={handleImageUpload}
                               style={{display: 'none'}}/>
                    </label>
                </Box>
                <Box sx={{marginTop: '16px'}}>
                    <label htmlFor="description" style={{
                        fontSize: '32px',
                        fontFamily: 'Quicksand',
                        color: 'black',
                        marginBottom: '-10px',
                        display: 'block'
                    }}>
                        <Typography variant="h4">{t("description")}</Typography>    
                    </label><br/>
                    <textarea id="description" name="description" rows={5} defaultValue={description}
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
                    <label htmlFor="choice" style={{
                        fontSize: '32px',
                        fontFamily: 'Quicksand',
                        color: 'black',
                        marginBottom: '-10px',
                        display: 'block'
                    }}>
                        <Typography variant="h4">{t("access")}</Typography>    
                    </label><br/>
                    <select id="choice" name="choice" defaultValue={open.toString()}
                            onChange={(event) => (setOpen(event.target.value === 'true'))} style={{
                        fontSize: '20px',
                        fontFamily: 'Quicksand',
                        borderRadius: '6px',
                        padding: '5px'
                    }}>
                        <option value="false">{t("private")}</option>
                        <option value="true">{t("public")}</option>
                    </select>
                </Box>
                <Box sx={{marginTop: '0px', position: 'absolute', gap: 0}}>
                    <button type="submit" style={{
                        backgroundColor: '#1E64C8',
                        color: 'white',
                        padding: '8px 16px',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontFamily: 'Quicksand',
                        fontSize: '16px',
                        marginTop: '10px',
                    }}>
                        <Typography variant="h6">{t("save changes")}</Typography>
                    </button>
                    <button
                        onClick={() => window.location.href = '/course/' + courseId + "/"}
                        style={{
                            backgroundColor: '#1E64C8',
                            color: 'white',
                            padding: '8px 16px',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontFamily: 'Quicksand',
                            fontSize: '16px',
                            marginTop: '10px',
                            marginLeft: '15px'
                        }}>
                            <Typography variant="h6">{t("cancel")}</Typography>
                    </button>
                </Box>
            </form>
        ));

}

export default EditCourseForm