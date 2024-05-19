"use client";
import { useState, useEffect } from 'react';
import NavBar from "@app/[locale]/components/NavBar";
import {Box, CircularProgress} from "@mui/material";
import initTranslations from "@app/i18n";
import EditCourseForm from "@app/[locale]/components/EditCourseForm";
import DeleteButton from "@app/[locale]/components/course_components/DeleteButton";
import TranslationsProvider from "@app/[locale]/components/TranslationsProvider";
import ArchiveButton from "@app/[locale]/components/course_components/ArchiveButton";
import {UserData, getUserData} from "@lib/api";

function CourseEditPage({params: {locale, course_id}}: { params: { locale: any, course_id: number } }) {
    const [resources, setResources] = useState()
    const [user, setUser] = useState<UserData | null>(null);
    const [userLoading, setUserLoading] = useState(true);

    useEffect(() => {
        initTranslations(locale, ["common"]).then((result) => {
            setResources(result.resources)
        })

        const fetchUser = async () => {
            try {
                setUser(await getUserData());
            } catch (error) {
                console.error("There was an error fetching the user data:", error);
            }
        }

        fetchUser();
        setUserLoading(false);
    }, [locale])

    return (
        <TranslationsProvider
            resources={resources}
            locale={locale}
            namespaces={["common"]}
        >
            <NavBar/>
            {userLoading ? (
                <Box padding={5} sx={{ display: 'flex' }}>
                    <CircularProgress />
                </Box>
            ) : (
                    user?.role === 3 ? (
                        window.location.href = `/403/`
                    ) : (
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
                    )
                )}
        </TranslationsProvider>
    );
}

export default CourseEditPage;
