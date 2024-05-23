'use client';
import NavBar from "@app/[locale]/components/NavBar";
import {Box, CircularProgress} from "@mui/material";
import initTranslations from "@app/i18n";
import TranslationsProvider from "@app/[locale]/components/TranslationsProvider";
import CreateCourseForm from "@app/[locale]/components/CreateCourseForm";
import React, {useEffect, useState} from "react";
import {fetchUserData, UserData} from "@lib/api";

const i18nNamespaces = ['common']

function CourseCreatePage({params: {locale}}: { params: { locale: any } }) {
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
                if (userData.role === 3) {
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
        <TranslationsProvider
            resources={resources}
            locale={locale}
            namespaces={i18nNamespaces}
        >
            <NavBar/>
            {!accessDenied &&
                <Box
                    width={'100%'}
                    sx={{
                        padding: 5,
                    }}
                >
                    <CreateCourseForm/>
                </Box>
            }
        </TranslationsProvider>
    )
}

export default CourseCreatePage;
