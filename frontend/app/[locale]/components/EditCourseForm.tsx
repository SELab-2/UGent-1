"use client"
import React, {useEffect, useState} from "react";
import axios from "axios";
import Box from "@mui/material/Box";
import {useTranslation} from "react-i18next";

const backend_url = process.env['NEXT_PUBLIC_BACKEND_URL'];

interface EditCourseFormProps {
    courseId: number
}

const EditCourseForm = ({courseId}:EditCourseFormProps) => {
    const [courseData, setCourseData] = useState({ name: '', description: '' });
    const {t} = useTranslation();

    useEffect(() => {
        const fetchCourseData = async () => {
            try {
                const response = await axios.get(backend_url + "/courses/" + courseId, { withCredentials: true });
                if (response.data) {
                    setCourseData(response.data);
                } else {
                    console.error("Unexpected response structure:", response.data);
                }
            } catch (error) {
                console.error("There was an error fetching the course data:", error);
            }
        };

        fetchCourseData();
    }, [courseId]);

    const handleSubmit = async (event: any) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        const formDataObject = Object.fromEntries(formData.entries());

        try {
            await axios.put(backend_url + "/courses/" + courseId, formDataObject, { withCredentials: true });
            alert('Course updated successfully!');
        } catch (error) {
            console.error("There was an error updating the course:", error);
            alert('An error occurred. Please try again later.');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <Box sx={{marginTop: '16px'}}>
                <label htmlFor="name" style={{
                    fontSize: '32px',
                    fontFamily: 'Arial, sans-serif',
                    marginBottom: '-10px',
                    display: 'block'
                }}>{t("Course name")}</label><br/>
                <input type="text" id="name" name="name" defaultValue={courseData.name} required style={{
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
                }}>{t("Banner")}</label><br/>
                <img src={selectedImage} alt="Image" style={{
                    width: '100%',
                    height: '220px',
                    objectFit: 'cover',
                    objectPosition: 'center',
                    borderRadius: '12px'
                }}/>
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
                    {t("Select image")}
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
                }}>{t("Description")}</label><br/>
                <textarea id="description" name="description" rows={5} defaultValue={courseData.description} required
                          style={{
                              width: '100%',
                              fontFamily: 'Arial, sans-serif',
                              color: '#1E64C8',
                              borderRadius: '6px',
                              padding: '10px'
                          }}/>
            </Box>
            <Box sx={{marginTop: '16px'}}>
                <label htmlFor="choice" style={{
                    fontSize: '32px',
                    fontFamily: 'Arial, sans-serif',
                    color: '#1E64C8',
                    marginBottom: '-10px',
                    display: 'block'
                }}>Access</label><br/>
                <select id="choice" name="choice" style={{
                    fontSize: '20px',
                    fontFamily: 'Arial, sans-serif',
                    borderRadius: '6px',
                    padding: '5px'
                }}>
                    <option value="option1">{t("Private")}</option>
                    <option value="option2">{t("Public")}</option>
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
                }}>{t("Save changes")}</button>
            </Box>
        </form>
    )
}

export default EditCourseForm