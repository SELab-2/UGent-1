"use client"
import React, {useEffect, useState} from "react";
import axios from "axios";
import Box from "@mui/material/Box";
import {useTranslation} from "react-i18next";
import banner from "../../../public/ugent_banner.png";
import Image from 'next/image';
import {updateCourse} from "@lib/api";

const backend_url = process.env['NEXT_PUBLIC_BACKEND_URL'];

interface EditCourseFormProps {
    courseId: number
}

const EditCourseForm = ({courseId}: EditCourseFormProps) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    let [open, setOpen] = useState(false);
    const {t} = useTranslation();
    const [selectedImage, setSelectedImage] = useState(banner);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCourseData = async () => {
            try {
                const response = await axios.get(backend_url + "/courses/" + courseId, {withCredentials: true});
                if (response.data) {
                    const data = response.data
                    setName(data.name);
                    setDescription(data.description);
                    open = data.open_course;
                } else {
                    console.error("Unexpected response structure:", response.data);
                }
            } catch (error) {
                console.error("There was an error fetching the course data:", error);
            }
            setLoading(false);
        };

        fetchCourseData();
    }, [courseId]);

    const handleSubmit = async (event: any) => {
        event.preventDefault();
        const courseData = {name: name, description: description, open_course: open};
        await updateCourse(courseId, courseData)
        window.location.reload();
    };

    const handleImageUpload = (event: any) => {
        const imageFile = event.target.files[0];
        const reader = new FileReader();

        reader.onload = () => {
            // Update the selectedImage state with the uploaded image data URL
            setSelectedImage(reader.result);
        };

        // Read the uploaded image as a data URL
        if (imageFile) {
            reader.readAsDataURL(imageFile);
        }
    };

    return (
        loading ? (<div>Loading...</div>) : (
            <form onSubmit={handleSubmit}>
                <Box sx={{marginTop: '16px'}}>
                    <label htmlFor="name" style={{
                        fontSize: '32px',
                        fontFamily: 'Arial, sans-serif',
                        marginBottom: '-10px',
                        display: 'block'
                    }}>{t("course name")}</label><br/>
                    <input type="text" id="name" name="name" defaultValue={name}
                           onChange={(event: any) => setName(event.target.value)} required style={{
                        fontSize: '20px',
                        fontFamily: 'Arial, sans-serif',
                        borderRadius: '6px',
                        height: '30px',
                        width: '220px'
                    }}/>
                </Box>
                <Box sx={{marginTop: '16px', borderRadius: '12px'}} style={{height: '250px'}}>
                    <label htmlFor="banner" style={{
                        fontSize: '32px',
                        fontFamily: 'Arial, sans-serif',
                        color: '#1E64C8'
                    }}>{t("banner")}</label><br/>
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
                                src={selectedImage}
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
                        color: '#1E64C8',
                        fontFamily: 'Arial, sans-serif'
                    }}>
                        {t("select image")}
                        <input type="file" id="Image" name="Image" accept="image/*" onChange={handleImageUpload}
                               style={{display: 'none'}}/>
                    </label>
                </Box>
                <Box sx={{marginTop: '16px'}}>
                    <label htmlFor="description" style={{
                        fontSize: '32px',
                        fontFamily: 'Arial, sans-serif',
                        color: '#1E64C8',
                        marginBottom: '-10px',
                        display: 'block'
                    }}>{t("description")}</label><br/>
                    <textarea id="description" name="description" rows={5} defaultValue={description}
                              onChange={(event: any) => setDescription(event.target.value)} required
                              style={{
                                  width: '100%',
                                  fontFamily: 'Arial, sans-serif',
                                  color: '#1E64C8',
                                  borderRadius: '6px',
                                  padding: '10px',
                                  boxSizing: 'border-box'
                              }}/>
                </Box>
                <Box sx={{marginTop: '16px'}}>
                    <label htmlFor="choice" style={{
                        fontSize: '32px',
                        fontFamily: 'Arial, sans-serif',
                        color: '#1E64C8',
                        marginBottom: '-10px',
                        display: 'block'
                    }}>{t("access")}</label><br/>
                    <select id="choice" name="choice" defaultValue={open.toString()}
                            onChange={(event) => (setOpen(event.target.value === 'true'))} style={{
                        fontSize: '20px',
                        fontFamily: 'Arial, sans-serif',
                        borderRadius: '6px',
                        padding: '5px'
                    }}>
                        <option value="false">{t("private")}</option>
                        <option value="true">{t("public")}</option>
                    </select>
                </Box>
                <Box sx={{marginTop: '16px', position: 'absolute'}}>
                    <button type="submit" style={{
                        backgroundColor: '#1E64C8',
                        color: 'white',
                        padding: '8px 16px',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontFamily: 'Arial, sans-serif',
                        fontSize: '16px',
                        marginTop: '80px'
                    }}>{t("save changes")}</button>
                </Box>
            </form>
        ));

}

export default EditCourseForm