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
                <label htmlFor="name">{t("name")}:</label><br/>
                <input type="text" id="name" name="name" defaultValue={courseData.name} required/>
            </Box>
            <Box sx={{marginTop: '16px'}}>
                <label htmlFor="description">{t("description")}:</label><br/>
                <textarea id="description" name="description" defaultValue={courseData.description} rows={4} required/>
            </Box>
            <Box sx={{marginTop: '16px'}}>
                <button type="submit">{t("save")}</button>
            </Box>
        </form>
    )
}

export default EditCourseForm