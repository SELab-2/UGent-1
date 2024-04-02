"use client";
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import NavBar from "../components/NavBar";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import initTranslations from "../../i18n";

const backend_url = process.env['NEXT_PUBLIC_BACKEND_URL'];
const getCookieValue = (name : string) => (
    document.cookie.match('(^|;)\\s*' + name + '\\s*=\\s*([^;]+)')?.pop() || ''
)

function CourseCreatePage({ params: { locale } }: { params: { locale: any } }) {
    const [translations, setTranslations] = useState({ t: (key: any) => key });
    axios.defaults.headers.post['X-CSRFToken'] = getCookieValue('csrftoken');

    useEffect(() => {
        const initialize = async () => {
            const translations = await initTranslations(locale, ['common']);
            setTranslations(translations);
        };

        initialize();
    }, [locale]);

    const handleSubmit = async (event: any) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        const formDataObject = Object.fromEntries(formData.entries());
        console.log(formDataObject)
        try {
            await axios.post(backend_url + "/courses/", formDataObject, { withCredentials: true });
            alert('Course created successfully!');
        } catch (error) {
            console.error("There was an error creating the course:", error);
            alert('An error occurred. Please try again later.');
        }
    };

    return (
        <div>
            <NavBar />
            <Box sx={{ marginTop: '64px' }}>
                <Typography variant="h3">
                    {translations.t("course_create")}
                </Typography>
                <form onSubmit={handleSubmit}>
                    <Box sx={{ marginTop: '16px' }}>
                        <label htmlFor="name">{translations.t("name")}:</label><br />
                        <input type="text" id="name" name="name" required />
                    </Box>
                    <Box sx={{ marginTop: '16px' }}>
                        <label htmlFor="description">{translations.t("description")}:</label><br />
                        <textarea id="description" name="description" rows={4} required />
                    </Box>
                    <Box sx={{ marginTop: '16px' }}>
                        <button type="submit">{translations.t("save")}</button>
                    </Box>
                </form>
            </Box>
        </div>
    );
}

export default CourseCreatePage;
