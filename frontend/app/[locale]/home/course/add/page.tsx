"use client";
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import NavBar from "../../../components/NavBar";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import initTranslations from "../../../../i18n";
import { postForm } from '@lib/api';

const backend_url = process.env['NEXT_PUBLIC_BACKEND_URL'];


function CourseCreatePage({ params: { locale } }: { params: { locale: any } }) {
    const [translations, setTranslations] = useState({ t: (key: any) => key });
    
    useEffect(() => {
        const initialize = async () => {
            const translations = await initTranslations(locale, ['common']);
            setTranslations(translations);
        };

        initialize();
    }, [locale]);

    return (
        <div>
            <NavBar />
            <Box sx={{ marginTop: '64px' }}>
                <Typography variant="h3">
                    {translations.t("course_create")}
                </Typography>
                <form onSubmit={postForm("/courses/")}>
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
