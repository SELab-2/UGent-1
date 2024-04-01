"use client";
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import NavBar from "../components/NavBar";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import initTranslations from "../../i18n";

const backend_url = process.env['NEXT_PUBLIC_BACKEND_URL'];

function CourseEditPage({ params: { locale, courseId } }: { params: { locale: any, courseId: string } }) {
    const [translations, setTranslations] = useState({ t: (key: any) => key });
    const [courseData, setCourseData] = useState({ name: '', description: '' });

    useEffect(() => {
        const initialize = async () => {
            const translations = await initTranslations(locale, ['common']);
            setTranslations(translations);
        };

        initialize();
    }, [locale]);

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
        <div>
            <NavBar />
            <Box sx={{ marginTop: '64px' }}>
                <Typography variant="h3">
                    {translations.t("course_edit")}
                </Typography>
                <form onSubmit={handleSubmit}>
                    <Box sx={{ marginTop: '16px' }}>
                        <label htmlFor="name">{translations.t("name")}:</label><br />
                        <input type="text" id="name" name="name" defaultValue={courseData.name} required />
                    </Box>
                    <Box sx={{ marginTop: '16px' }}>
                        <label htmlFor="description">{translations.t("description")}:</label><br />
                        <textarea id="description" name="description" defaultValue={courseData.description} rows={4} required />
                    </Box>
                    <Box sx={{ marginTop: '16px' }}>
                        <button type="submit">{translations.t("save")}</button>
                    </Box>
                </form>
            </Box>
        </div>
    );
}

export default CourseEditPage;
