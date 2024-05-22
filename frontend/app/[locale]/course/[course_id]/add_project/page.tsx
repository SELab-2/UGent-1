"use client"
import NavBar from "@app/[locale]/components/NavBar"
import ProjectEditForm from "@app/[locale]/project/[project_id]/edit/projectEditForm";
import TranslationsProvider from "@app/[locale]/components/TranslationsProvider";
import initTranslations from "@app/i18n";
import {useEffect, useState} from "react";
import {fetchUserData, UserData} from "@lib/api";
import {Box, CircularProgress} from "@mui/material";

const i18nNamespaces = ['common']

function ProjectAddPage({params: {locale, course_id}}: { params: { locale: any, course_id: number } }) {
    const [resources, setResources] = useState()
    const [user, setUser] = useState<UserData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [accessDenied, setAccessDenied] = useState(true);

    useEffect(() => {
        const initialize = async () => {
            try {
                const result = await initTranslations(locale, ["common"]);
                setResources(result.resources);
                const userData = await fetchUserData();
                setUser(userData);
                if (userData.role === 3 || !userData.course.includes(Number(course_id))) { // If the user is a student or the course is not in the user's courses
                    setAccessDenied(true);
                    window.location.href = `/403/`;
                } else {
                    setAccessDenied(false);
                }
            } catch (error) {
                console.error("There was an error initializing the page:", error);
            } finally {
                setIsLoading(false);
            }
        };

        initialize();
    }, [course_id, locale]);

    // If the page is still loading, display a loading spinner
    if (isLoading) {
        return (
            <Box padding={5} sx={{ display: 'flex' }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <TranslationsProvider locale={locale} namespaces={i18nNamespaces} resources={resources}>
            <NavBar/>
            {!accessDenied && <ProjectEditForm project_id={null} add_course_id={course_id}/>}
        </TranslationsProvider>
    );
}

export default ProjectAddPage;