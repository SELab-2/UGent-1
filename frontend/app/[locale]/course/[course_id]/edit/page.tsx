"use client";
import React, { useState, useEffect } from 'react';
import NavBar from "@app/[locale]/components/NavBar";
import {Box, CircularProgress} from "@mui/material";
import initTranslations from "@app/i18n";
import EditCourseForm from "@app/[locale]/components/EditCourseForm";
import DeleteButton from "@app/[locale]/components/course_components/DeleteButton";
import TranslationsProvider from "@app/[locale]/components/TranslationsProvider";
import ArchiveButton from "@app/[locale]/components/course_components/ArchiveButton";
import {UserData, fetchUserData} from "@lib/api";

function CourseEditPage({params: {locale, course_id}}: { params: { locale: any, course_id: number } }) {
    const [resources, setResources] = useState();
    const [user, setUser] = useState<UserData | null>(null);
    const [accessDenied, setAccessDenied] = useState(true);
    const [isLoading, setIsLoading] = useState(true);

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
        <TranslationsProvider
            resources={resources}
            locale={locale}
            namespaces={["common"]}
        >
            <NavBar/>
            {!accessDenied &&
                    <>
                        <Box
                            padding={5}
                            sx={{
                                display: 'flex',
                                alignItems: 'space-between',
                                justifyContent: 'space-between',
                                width: '100%',
                            }}
                        >
                            <EditCourseForm courseId={course_id}/>
                            <DeleteButton courseId={course_id}/>
                            <ArchiveButton course_id={course_id}/>
                        </Box>
                        <div id="extramargin" style={{height: "100px"}}></div>
                    </>
                }
        </TranslationsProvider>
    );
}

export default CourseEditPage;
