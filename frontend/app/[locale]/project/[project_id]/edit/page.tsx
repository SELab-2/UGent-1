"use client";
import NavBar from "../../../components/NavBar"
import ProjectEditForm from "@app/[locale]/project/[project_id]/edit/projectEditForm";
import TranslationsProvider from "@app/[locale]/components/TranslationsProvider";
import initTranslations from "@app/i18n";
import React, {useEffect, useState} from "react";
import {fetchUserData, getUserData, UserData} from "@lib/api";
import {Box, CircularProgress} from "@mui/material";

const i18nNamespaces = ['common']

function ProjectDetailPage({params: {locale, project_id}}: { params: { locale: any, project_id: any } }) {
    const [resources, setResources] = useState()
    const [user, setUser] = useState<UserData | null>(null);
    const [userLoading, setUserLoading] = useState(true);
    const [accessDenied, setAccessDenied] = useState(true);

    useEffect(() => {
        const initialize = async () => {
            try {
                const result = await initTranslations(locale, ["common"]);
                setResources(result.resources);
                const userData = await fetchUserData();
                setUser(userData);
                if (userData.role === 3) { // If the user is a student or the course is not in the user's courses
                    setAccessDenied(true);
                    window.location.href = `/403/`;
                } else {
                    setAccessDenied(false);
                }
            } catch (error) {
                console.error("There was an error initializing the page:", error);
            } finally {
                setUserLoading(false);
            }
        };

        initialize();
    }, [locale]);

    if (userLoading) {
        return (
            <Box padding={5} sx={{ display: 'flex' }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <TranslationsProvider locale={locale} namespaces={i18nNamespaces} resources={resources}>
            <NavBar/>
            {!accessDenied && <ProjectEditForm project_id={project_id} add_course_id={-1}/>}
        </TranslationsProvider>
    );
}

export default ProjectDetailPage;