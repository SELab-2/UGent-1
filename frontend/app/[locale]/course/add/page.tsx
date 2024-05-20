'use client';
import NavBar from "@app/[locale]/components/NavBar";
import {Box, CircularProgress} from "@mui/material";
import initTranslations from "@app/i18n";
import TranslationsProvider from "@app/[locale]/components/TranslationsProvider";
import CreateCourseForm from "@app/[locale]/components/CreateCourseForm";
import {useEffect, useState} from "react";
import {getUserData, UserData} from "@lib/api";

const i18nNamespaces = ['common']

function CourseCreatePage({params: {locale}}: { params: { locale: any } }) {
    const [resources, setResources] = useState()
    const [user, setUser] = useState<UserData | null>(null);
    const [userLoading, setUserLoading] = useState(true);
    const [accessDenied, setAccessDenied] = useState(true);

    useEffect(() => {
        initTranslations(locale, ["common"]).then((result) => {
            setResources(result.resources)
        })

        const fetchUser = async () => {
            try {
                const userData = await getUserData();
                setUser(userData);
                if (userData.role === 3) {
                    window.location.href = `/403/`;
                } else {
                    setAccessDenied(false);
                }

            } catch (error) {
                console.error("There was an error fetching the user data:", error);
            } finally {
                setUserLoading(false);
            }
        }

        fetchUser();
        setUserLoading(false);
    }, [locale])

    return (
        <TranslationsProvider
            resources={resources}
            locale={locale}
            namespaces={i18nNamespaces}
        >
            <NavBar/>
            {userLoading ? (
                <Box padding={5} sx={{ display: 'flex' }}>
                    <CircularProgress />
                </Box>
            ) : (
                !accessDenied &&
                    <Box
                        width={'100%'}
                        sx={{
                            padding: 5,
                        }}
                    >
                        <CreateCourseForm/>
                    </Box>
            )}
        </TranslationsProvider>
    )
}

export default CourseCreatePage;
