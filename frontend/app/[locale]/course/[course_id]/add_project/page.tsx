"use client"
import NavBar from "@app/[locale]/components/NavBar"
import ProjectEditForm from "@app/[locale]/project/[project_id]/edit/projectEditForm";
import TranslationsProvider from "@app/[locale]/components/TranslationsProvider";
import initTranslations from "@app/i18n";
import {useEffect, useState} from "react";
import {getUserData, UserData} from "@lib/api";
import {Box, CircularProgress} from "@mui/material";

const i18nNamespaces = ['common']

function ProjectAddPage({params: {locale, course_id}}: { params: { locale: any, course_id: number } }) {
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
        <TranslationsProvider locale={locale} namespaces={i18nNamespaces} resources={resources}>
            <NavBar/>
            {userLoading ? (
                <Box padding={5} sx={{ display: 'flex' }}>
                    <CircularProgress />
                </Box>
            ) : (
                user?.role === 3 ? (
                    window.location.href = `/403/`
                ) : (
                        <ProjectEditForm project_id={null} add_course_id={course_id}/>
            ))}
        </TranslationsProvider>
    );
}

export default ProjectAddPage;